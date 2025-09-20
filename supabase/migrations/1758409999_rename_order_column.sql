/*
  # [Rename "order" Column in Notifications]
  This migration renames the "order" column to "display_order" in the "notifications" table. The name "order" is a reserved SQL keyword, which can cause conflicts and unexpected behavior with certain database operations like bulk updates (upsert). Renaming it to a non-reserved word like "display_order" is a best practice that ensures stability and prevents these issues.

  ## Query Description:
  - This operation is structural and safe. It will not result in data loss.
  - It temporarily drops the security policies on the table, renames the column, and then recreates the policies. This is a standard and safe procedure for altering table structure under RLS.
  
  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (by reversing the RENAME operation)
  
  ## Structure Details:
  - Table: public.notifications
  - Column renamed: "order" -> "display_order"
  
  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: No (Policies are dropped and recreated identically to allow the column rename)
  - Auth Requirements: Admin (authenticated user)
  
  ## Performance Impact:
  - Indexes: The rename operation is fast and will not significantly impact performance.
  - Triggers: No triggers are affected.
  - Estimated Impact: Negligible.
*/

-- 1. Drop the existing RLS policies on the table to allow structural changes.
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."notifications";
DROP POLICY IF EXISTS "Enable admin access" ON "public"."notifications";

-- 2. Rename the column from the reserved keyword "order" to "display_order".
ALTER TABLE public.notifications
RENAME COLUMN "order" TO display_order;

-- 3. Recreate the RLS policies to restore security.
CREATE POLICY "Enable read access for all users" ON "public"."notifications"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable admin access" ON "public"."notifications"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
