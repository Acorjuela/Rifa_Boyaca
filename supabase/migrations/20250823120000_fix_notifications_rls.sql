/*
# [Fix Notification Permissions]
This operation updates the Row Level Security (RLS) policy for the 'notifications' table to allow authenticated users to perform UPDATE operations, which is necessary for reordering.

## Query Description: [This operation modifies the security policy for notifications to enable reordering functionality for administrators. It is a safe, non-destructive change.]

## Metadata:
- Schema-Category: ["Security"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Affects RLS policy on 'public.notifications' table.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Authenticated User]

## Performance Impact:
- Indexes: [No Change]
- Triggers: [No Change]
- Estimated Impact: [None]
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Allow admin full access to notifications" ON public.notifications;

-- Recreate the policy with the correct permissions
CREATE POLICY "Allow admin full access to notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
