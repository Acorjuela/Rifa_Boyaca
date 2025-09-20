/*
# [Schema Fix] Add 'is_enabled' column to notifications
This migration adds the missing 'is_enabled' column to the 'notifications' table. This is required for creating and managing notifications correctly.

## Query Description: [This is a safe, non-destructive operation that adds a new column with a default value. It will not affect existing data.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: public.notifications
- Column Added: is_enabled (boolean, NOT NULL, DEFAULT true)

## Security Implications:
- RLS Status: [No Change]
- Policy Changes: [No]
- Auth Requirements: [No Change]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Negligible]
*/

ALTER TABLE public.notifications
ADD COLUMN is_enabled boolean NOT NULL DEFAULT true;
