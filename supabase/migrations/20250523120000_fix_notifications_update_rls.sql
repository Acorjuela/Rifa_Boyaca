/*
# [Fix Notification Reordering Permissions]
This operation updates the Row Level Security (RLS) policy for the 'notifications' table to allow authenticated users (admins) to perform UPDATE operations, which is necessary for reordering.

## Query Description:
- This script modifies an existing security policy.
- It grants UPDATE permissions to authenticated users on the 'notifications' table.
- This change is safe and necessary for the drag-and-drop reordering feature to function correctly.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: public.notifications
- Policy: "Enable all actions for authenticated users on notifications"

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes, modifies an existing policy to include UPDATE.
- Auth Requirements: Affects 'authenticated' role.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/

-- Drop the existing policy to recreate it with the correct permissions
DROP POLICY IF EXISTS "Enable all actions for authenticated users on notifications" ON public.notifications;

-- Recreate the policy to allow ALL actions (INSERT, SELECT, UPDATE, DELETE) for authenticated users
CREATE POLICY "Enable all actions for authenticated users on notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
