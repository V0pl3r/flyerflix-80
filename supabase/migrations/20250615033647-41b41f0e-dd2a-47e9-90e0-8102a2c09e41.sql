
-- Desabilitar RLS temporariamente para limpar completamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Remover função anterior
DROP FUNCTION IF EXISTS public.can_access_own_profile(uuid);

-- Criar uma função mais simples que não causa recursão
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas mais simples usando auth.uid() diretamente
CREATE POLICY "users_can_view_own_profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
