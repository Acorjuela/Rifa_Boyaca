/*
          # [Seed Initial Data]
          Inserts the default configuration rows into the settings, packages, and prizes tables. This is necessary for the application to start correctly.

          ## Query Description: "This operation populates empty configuration tables with essential default data. It is safe to run on a new setup and will not affect existing data if run multiple times, as it checks for existence before inserting."
          
          ## Metadata:
          - Schema-Category: ["Data"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - Affects tables: settings, packages, prizes
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [No]
          - Auth Requirements: [service_role]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [Low]
          */

-- Seed settings table if it's empty
INSERT INTO public.settings (id, raffle_date, raffle_size, usd_to_cop_rate, raffle_info, payment_options, logo_url, winning_numbers)
SELECT 1, '2025-12-31T23:59:59Z', 1000, 4000, 
       '{"title": "Gran Rifa de Boyacá", "description": "Participa en nuestra sensacional rifa y apoya a los niños y niñas de Boyacá. ¡Gana premios increíbles!"}',
       '{"nequi": {"qr_url": "https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150.png?text=Nequi+QR", "enabled": true}, "binance": {"qr_url": "https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150.png?text=Binance+QR", "enabled": true}}',
       NULL,
       '{"cifras": "", "series": "", "cifrasTitle": "Ganador a Cifras ($200.000)", "seriesTitle": "Ganador a Series ($600.000)"}'
WHERE NOT EXISTS (SELECT 1 FROM public.settings WHERE id = 1);

-- Seed packages table if it's empty
INSERT INTO public.packages (id, label, price_cop, price_usd, numbers)
SELECT * FROM (VALUES
    (1, 'X1', 5000, 1.25, 1),
    (2, 'X2', 10000, 2.5, 2),
    (3, 'X3', 15000, 3.75, 3),
    (4, 'X4', 20000, 5, 4),
    (5, 'X5', 25000, 6.25, 5)
) AS v(id, label, price_cop, price_usd, numbers)
WHERE NOT EXISTS (SELECT 1 FROM public.packages);

-- Seed prizes table if it's empty
INSERT INTO public.prizes (id, url, enabled)
SELECT * FROM (VALUES
    (1, NULL, false),
    (2, NULL, false),
    (3, NULL, false),
    (4, NULL, false)
) AS v(id, url, enabled)
WHERE NOT EXISTS (SELECT 1 FROM public.prizes);
