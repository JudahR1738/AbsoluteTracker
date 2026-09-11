# AbsoluteTracker

AbsoluteTracker is a modern, full-stack comic book collection and tracking web application designed to help collectors catalog, organize, and explore their comic libraries. Built with a responsive, clean interface, users can manage their personal pull lists, track issue runs, and maintain complete oversight of their collection without friction.

---

## Features

### Current Features
* **Catalog Management:** Add, organize, and view comic books and runs across your personal collection.
* **User Authentication:** Secure account registration and session management powered by Supabase Auth.
* **Relational Storage:** Robust schema tracking issue details, publisher data, collection status, and custom metadata.
* **Modern Interface:** Fully responsive, dark-mode-first user interface styled with Tailwind CSS.

### Planned Features
* **Guest Demo Account:** Instantly test-drive the application with a pre-populated comic collection—no sign-up required.
* **Homepage Book Recommendations:** A discovery widget on the dashboard that dynamically surfaces random recommendations pulled directly from your existing library.
* **Series Progress Tracking:** Visual completion bars indicating missing issues from specific volume runs.
* **Advanced Filtering & Search:** Rapid filtering by publisher, writer, artist, era, and reading status.

---

## Tech Stack & Architecture

AbsoluteTracker uses a modern, unified TypeScript and serverless stack optimized for rapid query execution, relational integrity, and rapid iteration:

* **Framework:** Next.js (App Router, Server Components, and Server Actions)
* **Frontend:** React with Tailwind CSS for utility-first styling
* **Language:** TypeScript
* **Database & Auth:** Supabase (PostgreSQL with Row Level Security and Auth)
* **Deployment:** Vercel (Frontend & Edge Functions)

---

## Development & Local Setup

### Prerequisites
* **Node.js:** `v20.x` or higher
* **npm**, **pnpm**, or **yarn**
* A free **Supabase** project (or local Supabase CLI setup)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/absolutetracker.git
cd absolutetracker
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migrations
Apply your SQL schema files or migrations through the Supabase Dashboard SQL Editor or via the Supabase CLI:

```bash
npx supabase db push
```

### 4. Start the Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Deployment

AbsoluteTracker is structured for continuous deployment with **Vercel**:

1. Push your latest commits to the `main` branch on GitHub.
2. Link the repository in the Vercel dashboard.
3. Configure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables in your Vercel project settings.
4. Automatic deployment triggers on every push to `main`.
