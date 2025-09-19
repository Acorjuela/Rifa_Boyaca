/*
# [Operation Name]
Add More Prize Slots

## Query Description:
This operation adds two new prize slots (for Prize 3 and Prize 4) to the `prizes` table. This will allow the administrator to upload and manage two additional prize images from the admin panel. No existing data will be affected.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: public.prizes
- Action: INSERT

## Security Implications:
- RLS Status: Enabled
- Policy Changes: No
- Auth Requirements: None for this operation.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/
INSERT INTO public.prizes (id, url, enabled)
VALUES
  (3, NULL, false),
  (4, NULL, false)
ON CONFLICT (id) DO NOTHING;
