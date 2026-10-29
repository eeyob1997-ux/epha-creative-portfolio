# Creative Graphic Design Portfolio

A dark, responsive portfolio built with Next.js App Router, Tailwind CSS, and Supabase.

## Features

- Responsive portfolio landing page with selected projects, about, services and contact sections
- Demo project gallery while the database is not configured
- Supabase persistence for projects, testimonials, and contact submissions
- Admin login at `/admin/login`
- Admin dashboard at `/admin` to add, edit, publish, and delete projects, review testimonials, and view contact messages
- Project image uploads to Supabase Storage or support for existing image URLs
- API validation with Zod
- Supabase Auth cookie sessions
- Project CRUD API: `GET/POST /api/projects`, `PATCH/DELETE /api/projects/:id`
- Contact API: `POST /api/contact`

## Requirements

- Node.js 20 or newer
- A Supabase project

## Local setup

1. Copy `.env.example` to `.env.local` and set the Supabase project URL, publishable key, and UUID of the admin user. Create that user in Supabase Auth if needed. `SUPABASE_SERVICE_ROLE_KEY` is optional; if set, keep it server-only and never prefix it with `NEXT_PUBLIC_`.

2. Create a **public** Supabase Storage bucket named `projects` (or set `SUPABASE_PROJECTS_BUCKET` to your bucket name). If no service-role key is configured, create an upload policy for the admin user in the Supabase SQL Editor (replace the UUID with `SUPABASE_ADMIN_USER_ID`):

   ```sql
   create policy "Admin can upload project images"
   on storage.objects for insert to authenticated
   with check (
     bucket_id = 'projects'
     and auth.uid() = 'YOUR_ADMIN_USER_UUID'::uuid
   );
   ```

   If you use a custom bucket name, replace `projects` in this policy too.

3. In the Supabase SQL Editor, run [`supabase/admin-project-policies.sql`](./supabase/admin-project-policies.sql) after replacing **every** `YOUR_ADMIN_USER_UUID` with the admin user's UUID (the same value as `SUPABASE_ADMIN_USER_ID`). It configures project CRUD, contact-message submission/admin reading, testimonial submission/moderation, and public visibility rules. It also publishes the six example projects from the original setup. Admin requests use the service-role key when configured; otherwise they use the signed-in user's session and depend on these RLS policies.

4. Install dependencies and start the app:

   ```bash
   npm install
   npm run dev
   ```

5. Visit `http://localhost:3000/admin/login` and sign in with the admin user's Supabase Auth credentials.

## Adding projects

Sign in to `/admin`, then add or edit a project with an image URL or upload a PNG, JPG, WEBP, or GIF image (up to 5 MB). Uploaded images are stored in the configured public Supabase Storage bucket.

## Deploying

- Deploy the app to a Node-compatible platform such as Vercel.
- Set the Supabase environment variables in the deployment platform's environment settings.
- Use HTTPS and keep the admin user UUID and credentials out of client-side code.
- Treat `SUPABASE_SERVICE_ROLE_KEY` as a secret and configure it only as a server environment variable.
- Never commit `.env.local` or expose admin credentials.

## Production hardening

This is a starter template, not a security-audited production service. Before public launch, add login rate limiting, spam prevention for contact submissions, and policies tailored to your deployment. The contact form stores messages in the database; email notifications are not configured by default.
