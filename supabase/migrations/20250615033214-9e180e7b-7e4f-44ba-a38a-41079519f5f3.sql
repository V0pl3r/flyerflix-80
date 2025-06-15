
-- Remover todas as políticas existentes da tabela profiles
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Remover função existente se houver
DROP FUNCTION IF EXISTS public.can_access_own_profile(uuid);

-- Criar uma função security definer simples para verificar acesso próprio
CREATE OR REPLACE FUNCTION public.can_access_own_profile(profile_user_id uuid)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
AS $$
BEGIN
  RETURN auth.uid() = profile_user_id;
END;
$$;

-- Criar políticas RLS simples
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (public.can_access_own_profile(id));

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (public.can_access_own_profile(id));

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (public.can_access_own_profile(id));

-- Garantir que o bucket avatars existe e está público
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remover políticas antigas do storage
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public upload acesso ao bucket avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public select acesso ao bucket avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public update acesso ao bucket avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public delete acesso ao bucket avatars" ON storage.objects;

-- Criar políticas simplificadas para o storage
CREATE POLICY "avatars_upload_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "avatars_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_delete_auth" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars');
