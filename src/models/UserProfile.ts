
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  console.log('🔍 Buscando perfil do usuário:', userId);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      throw error;
    }

    console.log('✅ Perfil encontrado:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro inesperado ao buscar perfil:', error);
    throw error;
  }
};

export const createUserProfile = async (profile: ProfileInsert): Promise<Profile | null> => {
  console.log('🆕 Criando novo perfil:', profile);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar perfil:', error);
      throw error;
    }

    console.log('✅ Perfil criado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro inesperado ao criar perfil:', error);
    throw error;
  }
};

export const updateUserProfile = async (updates: ProfileUpdate & { id: string }): Promise<Profile | null> => {
  const { id, ...updateData } = updates;
  console.log('🔄 Atualizando perfil do usuário:', id);
  console.log('📝 Dados para atualizar:', updateData);
  
  try {
    // Primeiro, verificar se o perfil existe
    const existingProfile = await fetchUserProfile(id);
    if (!existingProfile) {
      console.log('👤 Perfil não existe, criando novo...');
      const newProfile: ProfileInsert = {
        id,
        ...updateData
      };
      return await createUserProfile(newProfile);
    }

    // Atualizar o perfil existente
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw error;
    }

    console.log('✅ Perfil atualizado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro inesperado ao atualizar perfil:', error);
    throw error;
  }
};

export const deleteUserProfile = async (userId: string): Promise<boolean> => {
  console.log('🗑️ Deletando perfil do usuário:', userId);
  
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ Erro ao deletar perfil:', error);
      throw error;
    }

    console.log('✅ Perfil deletado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro inesperado ao deletar perfil:', error);
    throw error;
  }
};
