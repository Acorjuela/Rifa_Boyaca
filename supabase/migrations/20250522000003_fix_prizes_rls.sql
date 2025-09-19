/*
# [Fix] RLS Policy for Prizes Table
[This migration adds a read-access policy to the 'prizes' table, allowing all users (anonymous and authenticated) to view the prize information. This is necessary for the application to load correctly.]

## Query Description: [This operation enables Row Level Security on the 'prizes' table and creates a policy named "Allow public read access to prizes". This policy permits anyone to perform SELECT operations on the table. It is a safe, non-destructive change that resolves a data-fetching error without affecting existing data.]

## Metadata:
- Schema-Category: ["Security", "Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: public.prizes
- Operation: ALTER TABLE, CREATE POLICY

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes, a new SELECT policy is added.
- Auth Requirements: None, this policy applies to all roles.

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Negligible. RLS adds a very small overhead to queries on this table.]
*/

-- 1. Enable RLS on the prizes table
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow public read access
CREATE POLICY "Allow public read access to prizes"
ON public.prizes
FOR SELECT
USING (true);
