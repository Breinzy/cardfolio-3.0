Cardfolio 3.0 — local-first portfolio tracker for TCG singles & sealed.

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

Key routes: `/`, `/holdings`, `/transactions`, `/strategy`.

APIs: `/api/holdings`, `/api/transactions`, `/api/strategy`, `/api/advice`, `/api/metrics/roi`, `/api/import/holdings`, `/api/export`.

## Prisma

```bash
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

## Environment

Create `.env.local`:

```
AI_MONTHLY_CAP_DOLLARS=5
DATABASE_URL="file:./prisma/dev.db"
```

## Architecture

- `app/` UI + API routes
- `components/` client components (AdvisorPanel, RoiChart, FileDrop)
- `lib/` shared logic: Prisma client, holdings/summary, transactions FIFO/service, advisor, ai router, metrics
- `prisma/` schema and seed

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
