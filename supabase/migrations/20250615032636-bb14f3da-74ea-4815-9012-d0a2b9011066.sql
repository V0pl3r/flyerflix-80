
-- Criar função para verificar se o usuário pode acessar seu próprio perfil
CREATE OR REPLACE FUNCTION public.can_access_own_profile(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN auth.uid() = profile_user_id;
END;
$function$;

-- Remover políticas existentes que causam recursão
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;

-- Criar novas políticas usando a função de segurança
CREATE POLICY "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
USING (public.can_access_own_profile(id));

CREATE POLICY "Users can update their own profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.can_access_own_profile(id));

CREATE POLICY "Users can insert their own profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.can_access_own_profile(id));
