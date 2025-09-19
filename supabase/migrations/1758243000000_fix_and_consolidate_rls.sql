--
-- RLS POLICIES FOR 'settings' TABLE
--
-- 1. Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow public read access" ON public.settings;
DROP POLICY IF EXISTS "Allow admin full access" ON public.settings;

-- 2. Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies
CREATE POLICY "Allow public read access" ON public.settings
FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON public.settings
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

--
-- RLS POLICIES FOR 'packages' TABLE
--
-- 1. Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.packages;
DROP POLICY IF EXISTS "Allow admin full access" ON public.packages;

-- 2. Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies
CREATE POLICY "Allow public read access" ON public.packages
FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON public.packages
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

--
-- RLS POLICIES FOR 'prizes' TABLE
--
-- 1. Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.prizes;
DROP POLICY IF EXISTS "Allow admin full access" ON public.prizes;

-- 2. Enable RLS
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies
CREATE POLICY "Allow public read access" ON public.prizes
FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON public.prizes
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

--
-- RLS POLICIES FOR 'tickets' TABLE
--
-- 1. Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.tickets;
DROP POLICY IF EXISTS "Allow admin full access" ON public.tickets;

-- 2. Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies
CREATE POLICY "Allow anonymous insert" ON public.tickets
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access" ON public.tickets
FOR ALL USING (auth.role() = 'authenticated');

--
-- RLS POLICIES FOR 'storage.objects'
--
-- 1. Drop existing policies
DROP POLICY IF EXISTS "Public read access for assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage all assets" ON storage.objects;

-- 2. Create new policies
CREATE POLICY "Public read access for assets" ON storage.objects 
FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Admin can manage all assets" ON storage.objects 
FOR ALL USING (bucket_id = 'assets' AND auth.role() = 'authenticated') 
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');
