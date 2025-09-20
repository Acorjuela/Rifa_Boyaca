-- Migration to fix missing 'colors' column and update RLS policies for notifications

-- 1. Add 'colors' column to 'settings' table if it doesn't exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'settings' AND column_name = 'colors'
    ) THEN
        ALTER TABLE public.settings ADD COLUMN colors jsonb;
    END IF;
END $$;

-- 2. Update the settings row with default colors if the colors column is null.
UPDATE public.settings
SET colors = '{
  "home": { "from": "#000759", "to": "#1b005b" },
  "reg": { "from": "#4d02b1", "to": "#001187" },
  "ticket": { "from": "#4d02b1", "to": "#001187" }
}'
WHERE id = 1 AND colors IS NULL;


-- 3. Drop and recreate the admin policy for the 'notifications' table to ensure UPDATE is allowed.
-- This ensures the reordering (which uses upsert/update) works correctly.

-- Drop the policy if it exists
DROP POLICY IF EXISTS "Allow admin full access" ON public.notifications;

-- Recreate the policy with full permissions for authenticated users
CREATE POLICY "Allow admin full access"
ON public.notifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
