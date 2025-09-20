/*
  # [Add Prize Category to Tickets]
  This operation adds a new column to the 'tickets' table to store which prize category (Cifras or Series) the ticket is for.

  ## Query Description:
  - Adds a 'prize_category' column of type TEXT to the 'tickets' table.
  - Adds a CHECK constraint to ensure the value can only be 'cifras' or 'series'.
  - This is a non-destructive operation. Existing tickets will have a NULL value for this new column, which is expected.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (The column can be dropped)

  ## Structure Details:
  - Table affected: public.tickets
  - Column added: prize_category (TEXT)
  - Constraint added: tickets_prize_category_check

  ## Security Implications:
  - RLS Status: Unchanged
  - Policy Changes: No
  - Auth Requirements: None

  ## Performance Impact:
  - Indexes: None added
  - Triggers: None added
  - Estimated Impact: Negligible. Adding a column with a default NULL value is a fast metadata-only change.
*/
ALTER TABLE public.tickets
ADD COLUMN prize_category TEXT;

ALTER TABLE public.tickets
ADD CONSTRAINT tickets_prize_category_check CHECK (prize_category IN ('cifras', 'series'));
