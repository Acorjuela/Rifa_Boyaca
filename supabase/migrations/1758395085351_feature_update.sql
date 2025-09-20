/*
  ## Description
  This migration adds support for new features:
  1.  Dynamic color gradients for different pages.
  2.  A system for creating and managing notifications.
  3.  It alters the 'settings' table and creates a new 'notifications' table.

  ## Safety
  - This is a non-destructive operation for existing data.
  - It adds new columns and a new table.
*/

-- Add a column to store color gradients in the settings table
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS color_gradients jsonb DEFAULT '{
  "home": ["#000759", "#1b005b"],
  "register": ["#4d02b1", "#001187"],
  "ticket": ["#4d02b1", "#001187"]
}'::jsonb;

-- Create the notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    video_url text,
    is_enabled boolean DEFAULT true NOT NULL,
    "position" integer NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Enable RLS for the new table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for the notifications table
-- Allow public read access for enabled notifications
CREATE POLICY "Enable read access for all users"
ON public.notifications FOR SELECT
USING (is_enabled = true);

-- Allow admin full access
CREATE POLICY "Enable full access for authenticated users"
ON public.notifications FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
