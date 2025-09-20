-- Habilitar RLS en todas las tablas si no está habilitado
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Allow public read access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admin full access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public read access to packages" ON public.packages;
DROP POLICY IF EXISTS "Allow admin full access to packages" ON public.packages;
DROP POLICY IF EXISTS "Allow public read access to prizes" ON public.prizes;
DROP POLICY IF EXISTS "Allow admin full access to prizes" ON public.prizes;
DROP POLICY IF EXISTS "Allow public read access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow admin full access to notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow public insert access to tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow admin full access to tickets" ON public.tickets;
DROP POLICY IF EXISTS "Public read access for assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access for assets" ON storage.objects;

-- Políticas para la tabla 'settings'
CREATE POLICY "Allow public read access to settings"
ON public.settings FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access to settings"
ON public.settings FOR ALL
USING (auth.role() = 'authenticated');

-- Políticas para la tabla 'packages'
CREATE POLICY "Allow public read access to packages"
ON public.packages FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access to packages"
ON public.packages FOR ALL
USING (auth.role() = 'authenticated');

-- Políticas para la tabla 'prizes'
CREATE POLICY "Allow public read access to prizes"
ON public.prizes FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access to prizes"
ON public.prizes FOR ALL
USING (auth.role() = 'authenticated');

-- Políticas para la tabla 'notifications'
CREATE POLICY "Allow public read access to notifications"
ON public.notifications FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access to notifications"
ON public.notifications FOR ALL
USING (auth.role() = 'authenticated');

-- Políticas para la tabla 'tickets'
CREATE POLICY "Allow public insert access to tickets"
ON public.tickets FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow admin full access to tickets"
ON public.tickets FOR ALL
USING (auth.role() = 'authenticated');

-- Políticas para el bucket 'assets' en Storage
CREATE POLICY "Public read access for assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Admin full access for assets"
ON storage.objects FOR ALL
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');
