/*
# [Operation Name]
Add Prize Type to Tickets

## Query Description: [This operation adds a new 'prize_type' column to the 'tickets' table to store whether a ticket is for 'cifras' or 'series'. It includes a check to ensure only these two values are allowed. This change is necessary to implement the prize selection feature.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: public.tickets
- Column Added: prize_type (text)
- Constraint Added: prize_type must be 'cifras' or 'series'

## Security Implications:
- RLS Status: [No Change]
- Policy Changes: [No]
- Auth Requirements: [No Change]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Negligible. Adding a column with a default will not cause significant performance issues on a small table.]
*/
ALTER TABLE public.tickets
ADD COLUMN prize_type TEXT CHECK (prize_type IN ('cifras', 'series'));
