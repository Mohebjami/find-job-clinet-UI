export type StoreCategory = "Grocery" | "Supermarket" | "Organic" | "Pharmacy" | "Specialty";

export type Store = {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  logo: string;
  color: string;
  cover: string;
  rating: number;
  reviews: string;
  deliveryMinutes: number;
  deliveryFee: number;
  promotion?: string;
  tags: string[];
};

export type Product = {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  label?: string;
};

export const stores: Store[] = [
  { id: "whole-foods", name: "Whole Foods Market", category: "Organic", description: "A little better for you. A whole lot of fresh.", logo: "whole", color: "#08613d", cover: "market", rating: 4.9, reviews: "2.4k", deliveryMinutes: 25, deliveryFee: 0, promotion: "$0 delivery on your first order", tags: ["Organic", "Fresh produce"] },
  { id: "fresh-mart", name: "FreshMart", category: "Grocery", description: "Your neighborhood favorites, freshly picked.", logo: "fresh", color: "#ef6c35", cover: "produce", rating: 4.8, reviews: "1.8k", deliveryMinutes: 15, deliveryFee: 2.99, promotion: "20% off your first order", tags: ["Local favorites", "Everyday essentials"] },
  { id: "trader-joes", name: "Trader Joe’s", category: "Supermarket", description: "Unexpected finds. Everyday good value.", logo: "trader", color: "#bd393c", cover: "grocery", rating: 4.9, reviews: "3.1k", deliveryMinutes: 30, deliveryFee: 3.99, tags: ["Pantry staples", "Great value"] },
  { id: "green-basket", name: "Green Basket", category: "Organic", description: "From thoughtful growers to your kitchen.", logo: "green", color: "#668446", cover: "greens", rating: 4.7, reviews: "860", deliveryMinutes: 20, deliveryFee: 1.99, promotion: "Fresh finds, up to 25% off", tags: ["Farm fresh", "Sustainable"] },
  { id: "costco", name: "Costco", category: "Supermarket", description: "Stock your shelves with more of what you love.", logo: "costco", color: "#cb303b", cover: "supermarket", rating: 4.8, reviews: "2.7k", deliveryMinutes: 45, deliveryFee: 4.99, tags: ["Bulk buys", "Family favorites"] },
  { id: "the-bread-basket", name: "The Bread Basket", category: "Specialty", description: "Slow-fermented, oven-fresh, and made with love.", logo: "bread", color: "#956238", cover: "bakery", rating: 4.9, reviews: "640", deliveryMinutes: 20, deliveryFee: 2.49, promotion: "A fresh start: 15% off", tags: ["Artisan bakery", "Baked daily"] },
  { id: "daily-care", name: "Daily Care Pharmacy", category: "Pharmacy", description: "A little care for your everyday wellbeing.", logo: "care", color: "#4d81a2", cover: "pharmacy", rating: 4.6, reviews: "920", deliveryMinutes: 15, deliveryFee: 0, tags: ["Personal care", "Wellness"] },
  { id: "local-harvest", name: "Local Harvest", category: "Grocery", description: "Seasonal goodness from farms close to home.", logo: "harvest", color: "#bd7a29", cover: "harvest", rating: 4.8, reviews: "1.2k", deliveryMinutes: 35, deliveryFee: 2.99, promotion: "Save $10 on orders over $50", tags: ["Seasonal", "Locally grown"] },
];

type CatalogItem = Omit<Product, "id" | "storeId">;
const groceryCatalog: CatalogItem[] = [
  { name: "Organic Hass Avocados", category: "Fruit & vegetables", price: 3.49, originalPrice: 4.49, unit: "2 pieces", image: "avocado", label: "Bestseller" },
  { name: "Sweet Strawberries", category: "Fruit & vegetables", price: 4.99, originalPrice: 5.99, unit: "1 lb pack", image: "strawberries" },
  { name: "Organic Bananas", category: "Fruit & vegetables", price: 1.29, unit: "1 bunch · approx. 1 lb", image: "bananas", label: "Organic" },
  { name: "Vine-Ripened Tomatoes", category: "Fruit & vegetables", price: 3.99, unit: "1 lb", image: "tomatoes" },
  { name: "Fresh Blueberries", category: "Fruit & vegetables", price: 4.49, unit: "6 oz pack", image: "blueberries" },
  { name: "Organic Baby Carrots", category: "Fruit & vegetables", price: 2.49, originalPrice: 2.99, unit: "1 lb bag", image: "carrots" },
  { name: "Farm Fresh Eggs", category: "Dairy & eggs", price: 5.99, unit: "12 large eggs", image: "eggs", label: "Free range" },
  { name: "Organic Whole Milk", category: "Dairy & eggs", price: 4.79, unit: "half gallon", image: "milk" },
  { name: "Creamy Greek Yogurt", category: "Dairy & eggs", price: 3.49, unit: "16 oz tub", image: "yogurt" },
  { name: "Artisan Sourdough Loaf", category: "Bakery", price: 6.49, originalPrice: 7.99, unit: "1 loaf · 500 g", image: "bread", label: "Baked today" },
  { name: "Butter Croissants", category: "Bakery", price: 5.49, unit: "4 pieces", image: "croissant" },
  { name: "Extra Virgin Olive Oil", category: "Pantry", price: 10.99, unit: "500 ml bottle", image: "oil" },
  { name: "Italian Penne Pasta", category: "Pantry", price: 2.99, unit: "16 oz pack", image: "pasta" },
  { name: "Freshly Roasted Coffee", category: "Drinks & snacks", price: 12.99, originalPrice: 15.99, unit: "12 oz whole beans", image: "coffee" },
  { name: "Cold-Pressed Orange Juice", category: "Drinks & snacks", price: 5.99, unit: "32 fl oz bottle", image: "juice" },
  { name: "Dark Chocolate Almonds", category: "Drinks & snacks", price: 6.49, unit: "8 oz bag", image: "almonds" },
];

const bakeryNames = ["Country Sourdough", "Strawberry Danish", "Banana Walnut Bread", "Tomato Focaccia", "Blueberry Muffins", "Carrot Cake Slice", "Brioche Buns", "Milk Bread Loaf", "Vanilla Yogurt Cake", "Rustic Baguette", "Butter Croissants", "Rosemary Olive Bread", "Cinnamon Morning Buns", "Coffee Cake", "Fresh Orange Cake", "Almond Croissants"];
const bakeryImages = ["bread", "croissant", "bread", "bread", "croissant", "bread", "croissant", "bread", "bread", "bread", "croissant", "bread", "croissant", "bread", "bread", "croissant"];
const pharmacyCatalog: CatalogItem[] = [
  ["Daily Vitamin C", "Vitamins", 8.99, "60 tablets"], ["Vitamin D3 Softgels", "Vitamins", 9.99, "90 softgels"], ["Daily Multivitamin", "Vitamins", 12.49, "60 gummies"], ["Magnesium Supplement", "Vitamins", 11.99, "60 capsules"],
  ["Gentle Face Cleanser", "Skin care", 10.49, "8 fl oz"], ["Daily Moisturizing Lotion", "Skin care", 8.49, "12 fl oz"], ["Mineral Sunscreen SPF 50", "Skin care", 14.99, "3 fl oz"], ["Soothing Aloe Vera Gel", "Skin care", 6.99, "8 fl oz"],
  ["Fluoride Toothpaste", "Personal care", 4.49, "4 oz tube"], ["Bamboo Toothbrush Set", "Personal care", 5.99, "2 pieces"], ["Gentle Hand Soap", "Personal care", 3.99, "10 fl oz"], ["Cotton Rounds", "Personal care", 2.99, "100 pieces"],
  ["Adhesive Bandage Variety", "Everyday essentials", 4.99, "30 pieces"], ["Pocket Tissues", "Everyday essentials", 2.49, "6 packs"], ["Hand Sanitizer", "Everyday essentials", 3.49, "8 fl oz"], ["Hydrating Lip Balm", "Everyday essentials", 3.99, "2 pieces"],
].map(([name, category, price, unit], index) => ({ name: String(name), category: String(category), price: Number(price), unit: String(unit), image: index < 4 ? "vitamins" : index < 8 ? "skincare" : "care", ...(index % 4 === 0 ? { originalPrice: Number(price) + 2 } : {}) }));

export const products: Product[] = stores.flatMap((store, storeIndex) => {
  const catalog = store.category === "Pharmacy" ? pharmacyCatalog : groceryCatalog;
  return catalog.map((product, index) => ({
    ...product,
    id: `${store.id}-${index + 1}`,
    storeId: store.id,
    price: Math.round((product.price + (storeIndex % 3) * 0.25) * 100) / 100,
    ...(product.originalPrice ? { originalPrice: Math.round((product.originalPrice + (storeIndex % 3) * 0.25) * 100) / 100 } : {}),
    ...(store.category === "Specialty" ? { name: bakeryNames[index], image: bakeryImages[index], category: index < 6 ? "Sweet treats" : index < 10 ? "Fresh bread" : "Pastries", unit: index < 6 ? "1 piece" : index < 10 ? "1 loaf" : "2 pieces", label: index % 5 === 0 ? "Baked today" : undefined } : {}),
  }));
});

export const storeCategories = ["All stores", "Grocery", "Supermarket", "Organic", "Pharmacy", "Specialty"];
export const formatMoney = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
export const getStore = (id: string) => stores.find((store) => store.id === id);
export const getStoreProducts = (id: string) => products.filter((product) => product.storeId === id);
