# Next.js + Supabase Starter

## 1. Project Description

This starter gives you everything you need to ship a modern web application with user accounts:

| Feature | Details |
|---|---|
| Auth (sign up / sign in / sign out) | Supabase Auth with email + password |
| Profile management | Full name + avatar stored in `public.profiles` |
| Avatar uploads | Supabase Storage with per-user RLS |
| Row Level Security | Users can only read/write their own data |
| Auto profile creation | PostgreSQL trigger fires on `auth.users` insert |
| Declarative schema | Schema defined in `supabase/schemas/`, migrated declaratively |
| Type safety | TypeScript throughout; DB types in `lib/supabase/types.ts` |
| Testing | Jest + Testing Library; examples for components, hooks, and utils |
| CI/CD | GitHub Actions workflow for production DB migrations |

---

## 2. Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Docker Desktop** — required by Supabase local dev ([docker.com](https://www.docker.com/products/docker-desktop/))
- **Supabase CLI** — installed automatically as a devDependency via `npm install` (no global install needed)
- **Git** — for version control and GitHub Actions

---

## 3. Quick Start (Setup Script)

The `setup.js` script automates the entire local setup. Make sure Docker Desktop is running, then:

```bash
git clone <your-repo-url>
cd nextjs-supabase-starter

node setup.js
```

The script will:
1. Run `npm install`
2. Start the local Supabase Docker containers
3. Extract the Supabase URL and anon key
4. Write your `.env.local` file
5. Apply database migrations via `supabase db reset`

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The script is idempotent — safe to run multiple times. If Supabase is already running it uses the existing instance. If `.env.local` already exists it is overwritten with fresh credentials.

---

## 4. Manual Setup

If you prefer to set up step-by-step:

```bash
# 1. Install dependencies
npm install

# 2. Start Supabase local development
npx supabase start

# 3. Note the API URL and anon key printed by the command above.
#    Create .env.local:
cp .env.example .env.local
# Then fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Apply migrations
npx supabase db reset

# 5. Start the dev server
npm run dev
```

---

## 5. Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project (local or production) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public anon key for your Supabase project |

These are both `NEXT_PUBLIC_` — they are safe to expose to the browser because Supabase RLS policies control what each user can access.

**Never commit `.env.local`** — it is listed in `.gitignore`.

---

## 6. Database Schema

### `public.profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key; references `auth.users(id)` |
| `email` | `text` | Copied from `auth.users` on creation |
| `full_name` | `text` | Editable by the user |
| `avatar_url` | `text` | Public URL to Supabase Storage object |
| `updated_at` | `timestamptz` | Auto-updated by trigger on every `UPDATE` |

### Declarative schema workflow

The schema is defined in `supabase/schemas/profiles.sql`. To regenerate the migration after making schema changes:

```bash
npx supabase db diff --schema public > supabase/migrations/<timestamp>_your_change.sql
```

### Triggers

**`on_auth_user_created`** — fires `AFTER INSERT ON auth.users`; calls `handle_new_user()` to insert a row in `public.profiles` automatically when a user registers.

**`on_profiles_updated`** — fires `BEFORE UPDATE ON public.profiles`; calls `handle_updated_at()` to keep `updated_at` current.

### Row Level Security

All access to `public.profiles` requires authentication (`auth.uid() = id`):

| Policy | Operation | Condition |
|---|---|---|
| Users can view own profile | SELECT | `auth.uid() = id` |
| Users can update own profile | UPDATE | `auth.uid() = id` |
| Users can insert own profile | INSERT | `auth.uid() = id` |

### Storage (avatars)

A public `avatars` bucket is created in the migration. Objects are stored at `<user-id>/<filename>`. Storage RLS ensures:
- Authenticated users can only upload/update/delete within their own folder
- Anyone can read (public URLs work without auth)

---

## 7. Authentication Patterns

### Server Components (recommended for data fetching)

Use helpers from `lib/auth.ts`:

```ts
import { getUser, requireUser, getUserProfile } from "@/lib/auth";

// Get user or null (non-redirecting)
const user = await getUser();

// Get user or redirect to /auth/login
const user = await requireUser();

// Get the full profile row
const profile = await getUserProfile();
```

### Client Components

Use the `useAuth` hook from `hooks/useAuth.ts`:

```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <p>Not signed in</p>;
  return <p>Hello, {profile?.full_name ?? user.email}</p>;
}
```

### Middleware protection

`middleware.ts` guards `/dashboard` and `/profile` — unauthenticated visitors are redirected to `/auth/login?redirectTo=<original-path>`. Auth pages redirect already-authenticated users to `/dashboard`.

---

## 8. Code Organisation

| Path | Purpose |
|---|---|
| `components/ui/` | Primitive, reusable UI components (Button, Input, Card, Alert) |
| `components/auth/` | Auth-specific form components (LoginForm, SignupForm, SignOutButton) |
| `components/` (root) | Page-level layout components (Navbar) |
| `hooks/` | Custom React hooks for client components |
| `lib/` | Shared utilities and server-side helpers |
| `lib/supabase/` | All Supabase client factories and DB types |
| `app/` | Pages and route segments (Next.js App Router) |

**Naming conventions:**
- Page components: `page.tsx` (Next.js convention)
- Client form/interactive components co-located with their page: e.g. `app/profile/ProfileForm.tsx`
- Hooks: `use` prefix, camelCase — e.g. `useAuth`
- Utility functions: lowercase camelCase in `lib/utils.ts`

---

## 9. Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# With coverage report
npm run test:coverage
```

### What's tested

- **`__tests__/lib/utils.test.ts`** — utility functions (`cn`, `getInitials`, `isValidEmail`, `formatRelativeTime`)
- **`__tests__/components/Button.test.tsx`** — Button renders, click handling, disabled/loading states
- **`__tests__/components/Alert.test.tsx`** — Alert variants and accessibility roles
- **`__tests__/hooks/useAuth.test.tsx`** — `useAuth` with a fully mocked Supabase client

### Adding new tests

1. Create a file under `__tests__/` mirroring the source path, e.g. `__tests__/components/Input.test.tsx`.
2. Import the component/function and write `describe` + `it` blocks.
3. For components that use Supabase, mock `@/lib/supabase/client` as shown in `useAuth.test.tsx`.

---

## 10. Deployment to Production

### 1. Create a production Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Copy the **Project URL** and **anon public key** from **Settings → API**.
3. Copy the **Project Reference ID** from **Settings → General** (you'll need it for the GitHub Action).
4. Copy the **Database Password** you set during project creation.

### 2. Run migrations on the production database

You can run migrations once manually before setting up CI:

```bash
# Link to your production project
npx supabase link --project-ref <YOUR_PROJECT_REF>

# Push all migrations
npx supabase db push
```

### 3. Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel
```

During setup, or in the Vercel dashboard under **Settings → Environment Variables**, add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your production Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your production anon key |

Set these for **Production**, **Preview**, and **Development** environments as needed.

### 4. Vercel-specific notes

- No additional `vercel.json` is needed — Next.js is auto-detected.
- Vercel's edge network works well with Supabase's `@supabase/ssr`.
- The `middleware.ts` file is automatically deployed as an Edge Function.

### 5. Deploy to Netlify (alternative)

1. Push your repo to GitHub.
2. Connect the repo in the Netlify dashboard.
3. Set build command: `npm run build`, publish directory: `.next`.
4. Add the same environment variables as above.
5. Install the **Essential Next.js** plugin if prompted.

---

## 12. GitHub Actions — Automatic Migrations

The workflow in `.github/workflows/deploy-migrations.yml` runs `supabase db push` on every push to `main` that touches migration files.

### Setup

Add the following secrets to your GitHub repository (**Settings → Secrets and variables → Actions → New repository secret**):

| Secret | How to find it |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_DB_PASSWORD` | The database password set when you created the project |
| `SUPABASE_PROJECT_ID` | **Settings → General → Reference ID** in your Supabase project |

### How it works

1. Push to `main` with changes in `supabase/migrations/` or `supabase/schemas/`.
2. The workflow runs `supabase link` (using your project ref + DB password), then `supabase db push`.
3. New migrations are applied; already-applied migrations are skipped.
4. The job fails loudly if a migration errors, preventing silent data issues.

### Manual trigger

You can also trigger the workflow manually from **Actions → Deploy Migrations → Run workflow** in the GitHub UI.

---

## 13. Troubleshooting

**Docker is not running**
> `Error: Cannot connect to the Docker daemon`

Start Docker Desktop and re-run `node setup.js`.

---

**Port conflicts**
> `Error: bind: address already in use`

Another process is using one of the Supabase ports (54321–54327). Stop the conflicting process or run `npx supabase stop` first.

---

**Session not refreshing / user is null on protected page**

Make sure `middleware.ts` is present at the project root (not inside `app/`). The middleware is responsible for refreshing the auth session cookie on every request.

---

**Avatar uploads fail with a policy error**

Check that the `avatars` storage bucket was created (run `npx supabase db reset` to reapply migrations). Also verify that the file is being uploaded to a path that starts with the user's UUID, e.g. `<user-id>/avatar.png`.

---

**`supabase` command not found**

The Supabase CLI is included as a devDependency — make sure you've run `npm install` first. The setup script handles this, but if running CLI commands manually use:
```bash
npx supabase --version
```

---

**GitHub Action fails: "project not found"**

Double-check that `SUPABASE_PROJECT_ID` is the **Reference ID** (a short alphanumeric string like `abcdefghijklmnop`), not the project name or URL.

---

**TypeScript errors after schema changes**

Regenerate the types:
```bash
npx supabase gen types typescript --local > lib/supabase/types.ts
```