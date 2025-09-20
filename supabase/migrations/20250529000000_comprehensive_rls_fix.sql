-- Comprehensive RLS Policy Fix

-- Enable RLS on all tables if not already enabled
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure a clean slate
-- Public policies (anon role)
DROP POLICY IF EXISTS "Allow public read access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public read access to packages" ON public.packages;
DROP POLICY IF EXISTS "Allow public read access to prizes" ON public.prizes;
DROP POLICY IF EXISTS "Allow public read access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow public insert access to tickets" ON public.tickets;

-- Admin policies (authenticated role)
DROP POLICY IF EXISTS "Allow full access for authenticated users on settings" ON public.settings;
DROP POLICY IF EXISTS "Allow full access for authenticated users on packages" ON public.packages;
DROP POLICY IF EXISTS "Allow full access for authenticated users on prizes" ON public.prizes;
DROP POLICY IF EXISTS "Allow full access for authenticated users on notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow full access for authenticated users on tickets" ON public.tickets;

-- Create new, correct policies

-- 1. SETTINGS TABLE
-- Public users can read the settings.
CREATE POLICY "Allow public read access to settings"
ON public.settings FOR SELECT
TO anon
USING (true);
-- Authenticated users (admin) can do anything.
CREATE POLICY "Allow full access for authenticated users on settings"
ON public.settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. PACKAGES TABLE
-- Public users can read the packages.
CREATE POLICY "Allow public read access to packages"
ON public.packages FOR SELECT
TO anon
USING (true);
-- Authenticated users (admin) can do anything.
CREATE POLICY "Allow full access for authenticated users on packages"
ON public.packages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. PRIZES TABLE
-- Public users can read the prizes.
CREATE POLICY "Allow public read access to prizes"
ON public.prizes FOR SELECT
TO anon
USING (true);
-- Authenticated users (admin) can do anything.
CREATE POLICY "Allow full access for authenticated users on prizes"
ON public.prizes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. NOTIFICATIONS TABLE
-- Public users can read the notifications.
CREATE POLICY "Allow public read access to notifications"
ON public.notifications FOR SELECT
TO anon
USING (true);
-- Authenticated users (admin) can do anything.
CREATE POLICY "Allow full access for authenticated users on notifications"
ON public.notifications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. TICKETS TABLE
-- Public users can create tickets.
CREATE POLICY "Allow public insert access to tickets"
ON public.tickets FOR INSERT
TO anon
WITH CHECK (true);
-- Authenticated users (admin) can do anything.
CREATE POLICY "Allow full access for authenticated users on tickets"
ON public.tickets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
