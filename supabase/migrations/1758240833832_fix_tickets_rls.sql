/*
# [Fix Ticket Access]
This migration adds a Row Level Security (RLS) policy to the `tickets` table to allow authenticated users (admins) to manage tickets.

## Query Description:
- This operation grants `SELECT`, `INSERT`, `UPDATE`, and `DELETE` permissions on the `tickets` table to any user who is logged in.
- This is necessary for the admin dashboard to function correctly.
- Without this policy, no one can read or write to the tickets table, causing the application to fail when fetching ticket data.

## Metadata:
- Schema-Category: ["Structural", "Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (by dropping the policy)

## Structure Details:
- Table: `public.tickets`
- Policy Added: "Allow full access for authenticated users"

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: This policy relies on Supabase's built-in `authenticated` role.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/

create policy "Allow full access for authenticated users" on "public"."tickets"
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
