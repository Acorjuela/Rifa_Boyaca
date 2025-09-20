-- Drop the old, incomplete policy if it exists
DROP POLICY IF EXISTS "admin_all_on_notifications" ON public.notifications;

-- Create a new, complete policy that allows authenticated users (admins) to do everything
CREATE POLICY "admin_all_on_notifications"
ON public.notifications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
