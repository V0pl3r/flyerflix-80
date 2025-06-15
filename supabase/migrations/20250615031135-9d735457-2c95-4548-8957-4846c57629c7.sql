
-- Primeiro, vamos remover todas as políticas existentes da tabela profiles para evitar recursão infinita
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Criar uma função security definer para verificar se o usuário pode acessar seu próprio perfil
CREATE OR REPLACE FUNCTION public.can_access_own_profile(profile_user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = profile_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Criar políticas simples sem recursão
CREATE POLICY "Enable read access for own profile" ON public.profiles
  FOR SELECT USING (public.can_access_own_profile(id));

CREATE POLICY "Enable update for own profile" ON public.profiles
  FOR UPDATE USING (public.can_access_own_profile(id));

CREATE POLICY "Enable insert for own profile" ON public.profiles
  FOR INSERT WITH CHECK (public.can_access_own_profile(id));

-- Garantir que o bucket avatars existe e está público
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remover políticas antigas do storage se existirem
DROP POLICY IF EXISTS "Public upload acesso ao bucket avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public select acesso ao bucket avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public update acesso ao bucket avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public delete acesso ao bucket avatars" ON storage.objects;

-- Criar políticas mais simples para o storage
CREATE POLICY "Allow authenticated uploads to avatars" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public access to avatars" ON storage.objects
  FOR SELECT 
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow users to update their avatars" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow users to delete their avatars" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');
