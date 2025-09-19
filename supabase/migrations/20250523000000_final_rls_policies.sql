/*
# [FINAL RLS SETUP]
This script enables Row Level Security (RLS) on all tables and creates the necessary policies for the application to function correctly. It allows public read access to configuration tables, public insert access for creating tickets, and full admin access for management.

## Query Description: [This operation secures your database by defining access rules. It is safe to run and necessary for the app to work. It does not modify or delete any of your existing data.]

## Metadata:
- Schema-Category: ["Security", "Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (by disabling RLS or dropping policies)

## Structure Details:
- Tables affected: settings, packages, prizes, tickets
- Storage buckets affected: assets

## Security Implications:
- RLS Status: Enabled on all tables.
- Policy Changes: Yes, this script adds all required policies for public and admin access.
- Auth Requirements: Defines policies for both anonymous (`anon`) and authenticated (`authenticated`) roles.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. RLS adds a small overhead but is essential for security.
*/

-- 1. Enable RLS on all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure a clean slate (optional but recommended)
DROP POLICY IF EXISTS "Public can read settings" ON public.settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.settings;
DROP POLICY IF EXISTS "Public can read packages" ON public.packages;
DROP POLICY IF EXISTS "Admins can update packages" ON public.packages;
DROP POLICY IF EXISTS "Public can read prizes" ON public.prizes;
DROP POLICY IF EXISTS "Admins can update prizes" ON public.prizes;
DROP POLICY IF EXISTS "Public can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins have full access to tickets" ON public.tickets;
DROP POLICY IF EXISTS "Public can view assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage assets" ON storage.objects;


-- 3. Policies for `settings` table
CREATE POLICY "Public can read settings"
ON public.settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Policies for `packages` table
CREATE POLICY "Public can read packages"
ON public.packages FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update packages"
ON public.packages FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Policies for `prizes` table
CREATE POLICY "Public can read prizes"
ON public.prizes FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update prizes"
ON public.prizes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Policies for `tickets` table
CREATE POLICY "Public can create tickets"
ON public.tickets FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins have full access to tickets"
ON public.tickets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Policies for `assets` storage bucket
CREATE POLICY "Public can view assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'assets');

CREATE POLICY "Admins can manage assets"
ON storage.objects FOR INSERT, UPDATE, DELETE
TO authenticated
USING (bucket_id = 'assets');
