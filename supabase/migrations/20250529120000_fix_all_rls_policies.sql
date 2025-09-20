/*
          # [Fix All RLS Policies]
          This script drops and recreates all Row Level Security (RLS) policies to ensure the application has the correct permissions to read public data and that the admin has full management access. This will resolve the "Failed to fetch" errors and pages stuck on "Loading...".

          ## Query Description: [This operation will reset the security policies for all tables. It is a safe operation that corrects permission issues without affecting your data. No backup is required.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - Affects policies on tables: settings, packages, prizes, tickets, notifications, storage.objects
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [Correctly sets policies for anonymous and authenticated roles]
          
          ## Performance Impact:
          - Indexes: [No change]
          - Triggers: [No change]
          - Estimated Impact: [None]
          */

-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow public read access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admin full access on settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public read access to packages" ON public.packages;
DROP POLICY IF EXISTS "Allow admin full access on packages" ON public.packages;
DROP POLICY IF EXISTS "Allow public read access to prizes" ON public.prizes;
DROP POLICY IF EXISTS "Allow admin full access on prizes" ON public.prizes;
DROP POLICY IF EXISTS "Allow public read access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow admin full access on notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow anonymous inserts on tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow admin full access on tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow anonymous read access to assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to manage assets" ON storage.objects;

-- Re-create policies with correct permissions

-- Settings Table
CREATE POLICY "Allow public read access to settings"
ON public.settings FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow admin full access on settings"
ON public.settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Packages Table
CREATE POLICY "Allow public read access to packages"
ON public.packages FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow admin full access on packages"
ON public.packages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Prizes Table
CREATE POLICY "Allow public read access to prizes"
ON public.prizes FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow admin full access on prizes"
ON public.prizes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Notifications Table
CREATE POLICY "Allow public read access to notifications"
ON public.notifications FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow admin full access on notifications"
ON public.notifications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Tickets Table
CREATE POLICY "Allow anonymous inserts on tickets"
ON public.tickets FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow admin full access on tickets"
ON public.tickets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage (Assets Bucket)
CREATE POLICY "Allow anonymous read access to assets"
ON storage.objects FOR SELECT
TO anon
USING ( bucket_id = 'assets' );

CREATE POLICY "Allow authenticated users to manage assets"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'assets' )
WITH CHECK ( bucket_id = 'assets' );
