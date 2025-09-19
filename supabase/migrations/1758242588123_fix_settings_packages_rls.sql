/*
# [Enable Public Read and Admin Write on Settings and Packages]
This migration creates Row Level Security (RLS) policies for the `settings` and `packages` tables. It allows any user (including anonymous visitors) to read the data, which is necessary for the public-facing site to function. It also allows authenticated users (the admin) to update this data.

## Query Description: [This operation is safe and essential for the application to work. It enables read access to public configuration and write access for administrators, without exposing sensitive data.]

## Metadata:
- Schema-Category: ["Safe", "Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tables affected: `public.settings`, `public.packages`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Read access is public, Write access requires authentication.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: [Negligible performance impact. Adds a standard RLS policy check.]
*/

-- POLICIES FOR 'settings' TABLE
CREATE POLICY "Allow public read access on settings"
ON public.settings
FOR SELECT
USING (true);

CREATE POLICY "Allow admin update access on settings"
ON public.settings
FOR UPDATE
USING (auth.role() = 'authenticated');


-- POLICIES FOR 'packages' TABLE
CREATE POLICY "Allow public read access on packages"
ON public.packages
FOR SELECT
USING (true);

CREATE POLICY "Allow admin update access on packages"
ON public.packages
FOR UPDATE
USING (auth.role() = 'authenticated');
