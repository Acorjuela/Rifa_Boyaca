/*
# [Function] get_occupied_numbers
Creates a function to securely fetch all numbers from existing tickets.

## Query Description:
This function, `get_occupied_numbers`, aggregates all numbers from the `tickets` table. It is designed to be called by anonymous users to check which raffle numbers are already taken without exposing any other ticket information.

- The function is set with `SECURITY DEFINER` to bypass Row-Level Security (RLS) on the `tickets` table temporarily, allowing it to read the necessary data.
- It returns a JSON array of integers.
- The cost is set to 100 to indicate it's a moderately expensive query.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (the function can be dropped)

## Security Implications:
- RLS Status: The function bypasses RLS for the `tickets` table within its execution context only.
- Policy Changes: No
- Auth Requirements: The function is granted execution permission to the `anon` and `authenticated` roles, making it publicly accessible.
*/
CREATE OR REPLACE FUNCTION get_occupied_numbers()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
COST 100
AS $$
  SELECT json_agg(DISTINCT numbers_unnested)
  FROM tickets, unnest(numbers) AS numbers_unnested;
$$;

-- Grant execution rights to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_occupied_numbers() TO anon;
GRANT EXECUTE ON FUNCTION public.get_occupied_numbers() TO authenticated;
