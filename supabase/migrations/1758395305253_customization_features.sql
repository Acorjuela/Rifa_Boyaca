/*
          # [Schema Upgrade] Add Customization Features
          [This operation adds new tables and columns to support theme color customization and a notification system.]

          ## Query Description: [This operation is safe and will not affect existing data. It adds a 'theme_colors' column to the 'settings' table and creates a new 'notifications' table. It also seeds the new column with default color values.]
          
          ## Metadata:
          - Schema-Category: ["Structural", "Data"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Adds column 'theme_colors' to 'settings' table.
          - Creates new table 'notifications' with columns: id, title, description, video_url, is_active, order, created_at.
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [Admin access for notifications, public read for notifications]
          
          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Low. Adds a new table and a column to an existing small table.]
          */

-- Step 1: Add theme_colors column to settings table
ALTER TABLE public.settings
ADD COLUMN theme_colors jsonb;

-- Step 2: Update the existing settings row with default theme colors
UPDATE public.settings
SET theme_colors = '{
  "home": { "from": "#000759", "to": "#1b005b" },
  "registration": { "from": "#4d02b1", "to": "#001187" },
  "ticket": { "from": "#4d02b1", "to": "#001187" }
}'
WHERE id = 1;

-- Step 3: Create the notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text,
  is_active boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Step 4: Enable RLS for the notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for the notifications table
-- Policy: Allow public read access
CREATE POLICY "Allow public read access to notifications"
ON public.notifications
FOR SELECT
USING (true);

-- Policy: Allow admin full access
CREATE POLICY "Allow admin full access to notifications"
ON public.notifications
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Step 6: Grant usage on the new table
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO authenticated;
GRANT SELECT ON TABLE public.notifications TO anon;
