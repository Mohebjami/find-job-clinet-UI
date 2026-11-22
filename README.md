This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Docker with Kiri and the Laravel backend

The production image uses Node.js 24 and Next.js [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), runs as a non-root user, and includes a Compose health check. Kiri must be running.

Start the existing Laravel/MySQL stack first, using its configured `.env`:

```bash
docker --context kiri compose -f ../my-project/compose.yaml up -d
```

From this directory, build and start Next.js:

```bash
docker --context kiri compose build --builder kiri-build
docker --context kiri compose up -d --wait
```

Open [http://localhost:3000](http://localhost:3000). The frontend joins the backend's existing `my-project_default` network. Browser requests to `/api/*` are [proxied by Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) to Laravel at `http://app:8000/api/*`, including authentication cookies and authorization headers. Use relative API URLs such as `/api/v1/auth/login` in frontend code.

Optional Compose settings can be supplied in an ignored `.env` file or exported in your shell:

| Variable | Default | Purpose |
| --- | --- | --- |
| `FRONTEND_PORT` | `3000` | Localhost port for Next.js |
| `BACKEND_NETWORK` | `my-project_default` | Existing Docker network containing Laravel |
| `BACKEND_URL` | `http://app:8000` | Backend origin used when building the API proxy |

`BACKEND_URL` is embedded during `next build`; rebuild the image after changing it. With `npm run dev` outside Docker, the proxy defaults to `http://127.0.0.1:8080`; override `BACKEND_URL` with a host-reachable address if needed. Backend credentials stay in the backend's `.env`; frontend `.env` files are excluded from the Docker build context.

```bash
docker --context kiri compose ps
docker --context kiri compose logs -f frontend
docker --context kiri compose down
```

Stopping this frontend stack leaves Laravel, MySQL, and their data running.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
