-- Fix function search_path for handle_updated_at()
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Add INSERT policy for profiles table (defense in depth)
CREATE POLICY "Users can create own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);