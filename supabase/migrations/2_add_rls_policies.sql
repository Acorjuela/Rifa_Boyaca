/*
          # [Enable Public Read Access]
          This migration enables Row Level Security (RLS) on public tables and creates policies to allow read-only access for everyone. This is crucial for the app to fetch public data like settings and packages.

          ## Query Description: 
          - Enables RLS for `settings`, `packages`, and `prizes` tables.
          - Creates a policy on each of these tables to allow public `SELECT` (read) operations.
          - The `tickets` table remains protected (no public read access).

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true (by dropping the policies and disabling RLS)
          
          ## Structure Details:
          - Tables affected: `settings`, `packages`, `prizes`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: This specifically allows public (unauthenticated) access.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible. RLS adds a small overhead, but it's necessary for security.
          */

-- Enable RLS for the tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors
DROP POLICY IF EXISTS "Allow public read access" ON public.settings;
DROP POLICY IF EXISTS "Allow public read access" ON public.packages;
DROP POLICY IF EXISTS "Allow public read access" ON public.prizes;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access"
ON public.settings FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON public.packages FOR SELECT
USING (true);

CREATE POLICY "Allow public read access"
ON public.prizes FOR SELECT
USING (true);
