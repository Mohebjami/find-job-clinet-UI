import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";

registerHooks({ resolve(specifier, context, nextResolve) {
  if (context.parentURL?.endsWith("/lib/grocery/cart.ts") && specifier === "./data") return nextResolve("./data.ts", context);
  return nextResolve(specifier, context);
} });

const { stores, products, getStoreProducts } = await import("../lib/grocery/data.ts");
const { parseCart, updateCart, cartTotals, MAX_QUANTITY } = await import("../lib/grocery/cart.ts");

test("all eight stores have distinct routes, full catalogs, and local image assets", () => {
  assert.equal(stores.length, 8);
  assert.equal(new Set(stores.map((store) => store.id)).size, 8);
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
  for (const store of stores) {
    const catalog = getStoreProducts(store.id);
    assert.ok(catalog.length >= 12 && catalog.length <= 20);
    assert.ok(existsSync(new URL(`../public/grocery/${store.cover}.jpg`, import.meta.url)), store.cover);
    for (const product of catalog) {
      assert.ok(product.price > 0);
      assert.ok(!product.originalPrice || product.originalPrice > product.price);
      assert.ok(existsSync(new URL(`../public/grocery/${product.image}.jpg`, import.meta.url)), product.image);
    }
  }
});

test("cart restoration safely rejects malformed and outdated browser storage", () => {
  for (const value of [null, "", "{invalid", "null", "false", "{}", "[null,1,\"text\",{}]", JSON.stringify([{ productId: "removed-product", quantity: 2 }])]) assert.deepEqual(parseCart(value), []);
});

test("cart restoration validates quantities, clamps limits, and deduplicates products", () => {
  assert.deepEqual(parseCart(JSON.stringify([
    { productId: products[0].id, quantity: 3 },
    { productId: products[0].id, quantity: 999 },
    { productId: products[1].id, quantity: -1 },
    { productId: products[2].id, quantity: 1.5 },
    { productId: products[3].id, quantity: "4" },
    { productId: products[4].id, quantity: 2 },
  ])), [{ productId: products[0].id, quantity: MAX_QUANTITY }, { productId: products[4].id, quantity: 2 }]);
});

test("adding, changing, and removing quantities preserves other stores and row order", () => {
  const first = products[0].id;
  const second = products[20].id;
  const original = updateCart(updateCart([], first, 1), second, 2);
  const updated = updateCart(original, first, 3);
  assert.deepEqual(updated, [{ productId: first, quantity: 3 }, { productId: second, quantity: 2 }]);
  assert.equal(original[0].quantity, 1);
  assert.deepEqual(updateCart(updated, first, 0), [{ productId: second, quantity: 2 }]);
});

test("cart ignores invalid products and nonfinite quantities", () => {
  const cart = [{ productId: products[0].id, quantity: 2 }];
  assert.deepEqual(updateCart(cart, "unknown-product", 10), cart);
  assert.deepEqual(updateCart(cart, products[0].id, NaN), cart);
  assert.deepEqual(updateCart(cart, products[0].id, Infinity), cart);
  assert.equal(updateCart(cart, products[0].id, 1000)[0].quantity, MAX_QUANTITY);
  assert.deepEqual(updateCart(cart, products[0].id, -1), []);
});

test("cart calculates precise prices in cents across multiple stores", () => {
  const first = products[0];
  const second = products[20];
  const totals = cartTotals([{ productId: first.id, quantity: 3 }, { productId: second.id, quantity: 2 }]);
  assert.equal(totals.count, 5);
  assert.equal(totals.subtotal, Math.round(first.price * 100) * 3 + Math.round(second.price * 100) * 2);
  assert.deepEqual(cartTotals([]), { count: 0, subtotal: 0 });
});
