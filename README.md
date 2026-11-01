# Krispi

Website for Krispi, a crispy-chicken takeaway in Veyangoda, Sri Lanka: a public site (home, menu, about, contact) and an admin page to manage the menu.

`/admin` is protected by a 6-digit PIN (see [Admin sign-in](#admin-sign-in)).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) with React 19 and TypeScript
- Tailwind CSS v4 and [shadcn/ui](https://ui.shadcn.com) (`base-nova` style, Base UI)
- TanStack Query for the admin forms, Server Actions for every write
- MongoDB (Mongoose) for categories and dishes, Cloudinary for dish photos
- ESLint, Prettier, Husky + lint-staged

## Getting started

```bash
npm install
# create a .env file with the variables below
npm run dev            # http://localhost:3000
```

### Environment variables

| Variable         | What it is                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`    | MongoDB connection string.                                                                           |
| `CLOUDINARY_URL` | `cloudinary://<api_key>:<api_secret>@<cloud_name>`. The key needs upload (create) and delete access. |

| `ADMIN_PIN` | The 6-digit PIN for `/admin`. Leave it empty and nobody can sign in. |
| `AUTH_SECRET` | Random secret (32+ characters) that signs the session cookie. Changing it signs everyone out. |

`.env` is gitignored, so each developer creates their own.

## Scripts

| Command                           | What it does                                            |
| --------------------------------- | ------------------------------------------------------- |
| `npm run dev` / `build` / `start` | Run, build and serve the app.                           |
| `npm run lint` / `lint:fix`       | ESLint (Next.js rules, import order, TypeScript rules). |
| `npm run format` / `format:check` | Prettier.                                               |
| `npm run typecheck`               | `tsc --noEmit`.                                         |
| `npm run check`                   | Lint + format check + typecheck. Run before pushing.    |

## Where things live

```
src/
  app/            routes (/, /menu, /about, /contact, /admin), error and not-found pages
  components/
    ui/           shadcn/ui components (add more with `npx shadcn@latest add <name>`)
    atoms/        smallest site pieces (Logo, Eyebrow, Price, ...)
    molecules/    small compositions (cards, FormCard, TableCard, ImageUploadField, ...)
    organisms/    page sections and the admin managers (forms + tables)
  hooks/          React Query: useCategories/useDishes (queries), useCreate*/useUpdate*/useDelete* (one
                  mutation hook per action), useActionMutation, useImageUpload
  lib/
    actions/      Server Actions, one file per action: category/, dish/, upload/ (e.g. dish/createDish.ts)
    db.ts         page content; menu-data.ts: cached MongoDB reads; schemas, helpers
  models/         Mongoose models (Category, Dish)
  data/db.json    static page copy
```

Each component lives in its own folder (`Name/Name.tsx` + `index.ts`) and is imported from its level barrel, e.g. `import { Hero } from '@/components/organisms'`.

## Admin sign-in

- `/admin/login` takes the PIN. A correct PIN sets a signed (JWT) **httpOnly** cookie that lasts 8 hours; script in the page can't read it.
- 5 wrong PINs from one IP lock sign-in for 15 minutes (`LoginAttempt`, cleaned up by a TTL index).
- Every request is checked in three layers: `src/proxy.ts` (cookie signature and expiry, no database), the admin page and every write Server Action (`verifySession` / `requireAdmin`, which also check the blocklist).
- **Sign out** deletes the cookie and puts the token's id on a blocklist (`RevokedToken`) until it would have expired anyway, so a copied cookie stops working too. A TTL index removes old entries.
- To sign everyone out at once, change `AUTH_SECRET`.

## How content flows

- **Static copy** (headings, labels, hero, story, contact details, SEO text) is in `src/data/db.json`.
- **Menu and signature dishes** are in MongoDB. The public pages read them through `src/lib/db.ts`; only dishes marked _Show on the menu_ appear, and dishes marked _Feature on the home page_ fill the home page's Signature dishes.
- **Photos** are uploaded from the admin page to the Cloudinary folder `krispy/dishes` (the folder name predates the Krispi spelling and is kept so existing photos keep working), shrunk in the browser first.
- Reads are cached with the tags `categories` and `dishes`. Every admin save calls `updateTag(...)`, so the public pages show the change straight away.
- Admin pages load their data on the server and pass it to the client forms as `initialData` for `useQuery`; saving goes through `useMutation` and a Server Action.
