CREATE TABLE public.signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.signups TO anon, authenticated;
GRANT ALL ON public.signups TO service_role;
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the list" ON public.signups FOR INSERT TO anon, authenticated WITH CHECK (true);