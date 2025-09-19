/*
# [Operation Name]
Seed Initial Data

## Query Description: [This script inserts essential default data into the 'settings', 'packages', and 'prizes' tables. This is necessary for the application to function correctly on first launch, as it expects this data to exist. Without this, queries using `.single()` will fail.]

## Metadata:
- Schema-Category: ["Data"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Inserts one row into the 'settings' table.
- Inserts five rows into the 'packages' table.
- Inserts four rows into the 'prizes' table.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [None for this script, but app requires RLS policies to be in place to read this data.]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Negligible. Inserts a small number of rows.]
*/

-- Seed initial settings
INSERT INTO public.settings (id, raffle_date, raffle_size, usd_to_cop_rate, raffle_info, payment_options, logo_url, winning_numbers)
VALUES (
    1,
    '2025-12-31T23:59:59Z',
    1000,
    4000,
    '{"title": "Gran Rifa de Boyacá", "description": "Participa y apoya una gran causa."}',
    '{"nequi": {"qr_url": "https://img-wrapper.vercel.app/image?url=https://placehold.co/200", "enabled": true}, "binance": {"qr_url": "https://img-wrapper.vercel.app/image?url=https://placehold.co/200", "enabled": true}}',
    NULL,
    '{"cifras": "????", "series": "???", "cifrasTitle": "Ganador a Cifras ($200.000)", "seriesTitle": "Ganador a Series ($600.000)"}'
)
ON CONFLICT (id) DO NOTHING;

-- Seed initial packages
INSERT INTO public.packages (id, label, price_cop, price_usd, numbers)
VALUES
    (1, 'X1', 5000, 1.25, 1),
    (2, 'X2', 10000, 2.5, 2),
    (3, 'X3', 15000, 3.75, 3),
    (4, 'X4', 20000, 5, 4),
    (5, 'X5', 25000, 6.25, 5)
ON CONFLICT (id) DO NOTHING;

-- Seed initial prizes
INSERT INTO public.prizes (id, url, enabled)
VALUES
    (1, NULL, true),
    (2, NULL, true),
    (3, NULL, true),
    (4, NULL, true)
ON CONFLICT (id) DO NOTHING;
