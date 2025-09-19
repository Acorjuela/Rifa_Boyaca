/*
# [Initial Schema Setup]
This script sets up the entire database schema for the Rifa application, including tables for settings, tickets, winners, packages, and prizes. It also configures Supabase Storage and sets up Row Level Security (RLS) to protect your data.

## Query Description: [This operation will create the foundational structure of your application's database. It is safe to run on a new project but would be destructive if tables with the same names already exist.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["High"]
- Requires-Backup: [false]
- Reversible: [false]

## Structure Details:
- Tables Created: settings, packages, winners, prizes, tickets.
- Storage Buckets Created: assets.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Public read access is granted for most tables, but write access is restricted to authenticated users (admins).]

## Performance Impact:
- Indexes: [Primary keys are indexed automatically.]
- Triggers: [None]
- Estimated Impact: [Low on an empty database.]
*/

-- 1. SETTINGS TABLE
-- Stores global configuration for the raffle.
CREATE TABLE public.settings (
    id INT PRIMARY KEY DEFAULT 1,
    raffle_date TIMESTAMPTZ NOT NULL DEFAULT (now() + '30 days'::interval),
    raffle_size INT NOT NULL DEFAULT 1000,
    raffle_title TEXT NOT NULL DEFAULT '¡SENSACIONAL RIFA!',
    raffle_description TEXT NOT NULL DEFAULT 'Apoya una buena causa y gana premios increíbles.',
    nequi_qr_url TEXT,
    nequi_enabled BOOLEAN NOT NULL DEFAULT true,
    binance_qr_url TEXT,
    binance_enabled BOOLEAN NOT NULL DEFAULT true,
    usd_to_cop_rate NUMERIC NOT NULL DEFAULT 4000,
    logo_url TEXT,
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- 2. PACKAGES TABLE
-- Stores the different ticket packages available for purchase.
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    price_cop INT NOT NULL,
    price_usd NUMERIC NOT NULL,
    numbers_amount INT NOT NULL,
    sort_order INT NOT NULL
);

-- 3. WINNERS TABLE
-- Stores the winning numbers and their titles.
CREATE TABLE public.winners (
    id INT PRIMARY KEY DEFAULT 1,
    cifras_title TEXT NOT NULL DEFAULT 'Ganador a Cifras ($200.000)',
    cifras_number TEXT NOT NULL DEFAULT '????',
    series_title TEXT NOT NULL DEFAULT 'Ganador de la Serie ($600.000)',
    series_number TEXT NOT NULL DEFAULT '???',
    CONSTRAINT single_row_check_winners CHECK (id = 1)
);

-- 4. PRIZES TABLE
-- Stores the images for the prizes shown on the ticket.
CREATE TABLE public.prizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT,
    enabled BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL
);

-- 5. TICKETS TABLE
-- Stores all the purchased tickets.
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    pais TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    numbers INT[] NOT NULL,
    total_value NUMERIC NOT NULL,
    payment_platform TEXT NOT NULL,
    reference TEXT NOT NULL,
    ticket_code TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false
);

-- 6. ENABLE RLS for all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES
-- Allow public read access for settings, packages, winners, prizes
CREATE POLICY "Allow public read access" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.winners FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.prizes FOR SELECT USING (true);

-- Allow admin full access for settings, packages, winners, prizes
CREATE POLICY "Allow admin full access" ON public.settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.packages FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.winners FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.prizes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Allow anonymous inserts for tickets, but only admins can read/update/delete
CREATE POLICY "Allow anonymous inserts" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access" ON public.tickets FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 8. SEED INITIAL DATA
-- Insert a single row for settings and winners
INSERT INTO public.settings (id) VALUES (1);
INSERT INTO public.winners (id) VALUES (1);

-- Insert default packages
INSERT INTO public.packages (label, price_cop, price_usd, numbers_amount, sort_order) VALUES
('X1 (1 número)', 5000, 1.25, 1, 1),
('X2 (2 números)', 10000, 2.50, 2, 2),
('X3 (3 números)', 15000, 3.75, 3, 3),
('X4 (4 números)', 20000, 5.00, 4, 4),
('X5 (5 números)', 25000, 6.25, 5, 5);

-- Insert default prize placeholders
INSERT INTO public.prizes (sort_order) VALUES (1), (2), (3), (4);

-- 9. SETUP STORAGE
-- Insert the 'assets' bucket for public files like logos, QRs, and prizes.
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the 'assets' bucket
CREATE POLICY "Allow public read access on assets" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Allow admin full access on assets" ON storage.objects FOR ALL USING (bucket_id = 'assets' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');
