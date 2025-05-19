
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'ultimate' | null;
  role: 'user' | 'admin' | 'super_admin';
  is_admin: boolean | null; // Added this property
  is_hidden: boolean;
  downloads_today: number | null;
  last_download_date: string | null;
  favorites: string[] | null;
  download_history: any[] | null;
  created_at: string;
  updated_at: string;
  user_id: string | null; // New field added by our migration
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Converter os dados brutos para o tipo UserProfile
    const userProfile: UserProfile = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      name: data.name,
      avatar_url: data.avatar_url,
      plan: data.plan as 'free' | 'ultimate' | null,
      role: data.role,
      is_admin: data.is_admin, // Include is_admin property here
      is_hidden: data.is_hidden,
      downloads_today: data.downloads_today,
      last_download_date: data.last_download_date,
      // Converter Json para string[] se não for null
      favorites: Array.isArray(data.favorites) ? data.favorites : (data.favorites ? [] : null),
      // Converter Json para any[] se não for null
      download_history: Array.isArray(data.download_history) ? data.download_history : (data.download_history ? [] : null),
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id
    };

    return userProfile;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    // Garante que temos um ID para atualizar
    if (!profile.id) {
      console.error('Cannot update profile without an ID');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        name: profile.name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        plan: profile.plan,
        is_admin: profile.is_admin, // Include is_admin in the update
        downloads_today: profile.downloads_today,
        last_download_date: profile.last_download_date,
        favorites: profile.favorites,
        download_history: profile.download_history,
        updated_at: new Date().toISOString(),
        user_id: profile.user_id || profile.id // Ensure user_id is set to link with auth.users
      })
      .eq('id', profile.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      
      // If profile doesn't exist yet, create it
      if (error.code === 'PGRST116') {
        return createUserProfile(profile);
      }
      
      return null;
    }

    if (!data) {
      return null;
    }

    // Converter os dados atualizados para o tipo UserProfile
    const updatedProfile: UserProfile = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      name: data.name,
      avatar_url: data.avatar_url,
      plan: data.plan as 'free' | 'ultimate' | null,
      role: data.role,
      is_admin: data.is_admin, // Include is_admin property here
      is_hidden: data.is_hidden,
      downloads_today: data.downloads_today,
      last_download_date: data.last_download_date,
      // Converter Json para string[] se não for null
      favorites: Array.isArray(data.favorites) ? data.favorites : (data.favorites ? [] : null),
      // Converter Json para any[] se não for null
      download_history: Array.isArray(data.download_history) ? data.download_history : (data.download_history ? [] : null),
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id
    };

    return updatedProfile;
  } catch (error) {
    console.error('Unexpected error updating user profile:', error);
    return null;
  }
}

// New function to create a user profile if it doesn't exist
async function createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    // Ensure we have an ID
    if (!profile.id) {
      console.error('Cannot create profile without an ID');
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: profile.id,
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        name: profile.name || null,
        email: profile.email || null,
        avatar_url: profile.avatar_url || null,
        plan: profile.plan || 'free',
        role: profile.role || 'user',
        is_admin: profile.is_admin !== undefined ? profile.is_admin : false, // Include is_admin with default value
        is_hidden: profile.is_hidden !== undefined ? profile.is_hidden : false,
        downloads_today: profile.downloads_today || 0,
        last_download_date: profile.last_download_date || null,
        favorites: profile.favorites || [],
        download_history: profile.download_history || [],
        user_id: profile.user_id || profile.id
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Convert to UserProfile type
    const newProfile: UserProfile = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      name: data.name,
      avatar_url: data.avatar_url,
      plan: data.plan as 'free' | 'ultimate' | null,
      role: data.role,
      is_admin: data.is_admin, // Include is_admin property here
      is_hidden: data.is_hidden,
      downloads_today: data.downloads_today,
      last_download_date: data.last_download_date,
      favorites: Array.isArray(data.favorites) ? data.favorites : (data.favorites ? [] : null),
      download_history: Array.isArray(data.download_history) ? data.download_history : (data.download_history ? [] : null),
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id
    };

    return newProfile;
  } catch (error) {
    console.error('Unexpected error creating user profile:', error);
    return null;
  }
}

export async function addToFavorites(userId: string, templateId: string): Promise<boolean> {
  // Primeiro, buscar o perfil do usuário para obter os favoritos atuais
  const { data, error } = await supabase
    .from('profiles')
    .select('favorites')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user favorites:', error);
    return false;
  }

  // Verificar se temos os dados de favoritos
  // Garantir que favorites seja um array, mesmo que venha como null ou undefined
  const currentFavorites = Array.isArray(data?.favorites) 
    ? data.favorites 
    : (data?.favorites ? [] : []);

  // Verificar se o template já está nos favoritos
  if (currentFavorites.includes(templateId)) {
    return true; // Já está nos favoritos, nada a fazer
  }

  // Adicionar o novo templateId aos favoritos
  const updatedFavorites = [...currentFavorites, templateId];

  // Atualizar o perfil com a nova lista de favoritos
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ favorites: updatedFavorites })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user favorites:', updateError);
    return false;
  }

  return true;
}

export async function removeFromFavorites(userId: string, templateId: string): Promise<boolean> {
  // Primeiro, buscar o perfil do usuário para obter os favoritos atuais
  const { data, error } = await supabase
    .from('profiles')
    .select('favorites')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user favorites:', error);
    return false;
  }

  // Verificar se temos os dados de favoritos
  // Garantir que favorites seja um array, mesmo que venha como null ou undefined
  const currentFavorites = Array.isArray(data?.favorites) 
    ? data.favorites 
    : (data?.favorites ? [] : []);

  // Filtrar o templateId a ser removido
  const updatedFavorites = currentFavorites.filter(id => id !== templateId);

  // Se não houver alteração, é porque o template não estava nos favoritos
  if (updatedFavorites.length === currentFavorites.length) {
    return true; // Nada a fazer
  }

  // Atualizar o perfil com a nova lista de favoritos
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ favorites: updatedFavorites })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user favorites:', updateError);
    return false;
  }

  return true;
}

export async function recordTemplateDownload(
  userId: string, 
  templateId: string,
  templateName: string
): Promise<boolean> {
  // Buscar os dados atuais do usuário
  const { data, error } = await supabase
    .from('profiles')
    .select('download_history, last_download_date, downloads_today')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user download history:', error);
    return false;
  }

  // Extrair os dados obtidos e garantir que são arrays mesmo quando vierem como null
  const downloadHistory = Array.isArray(data?.download_history) 
    ? data.download_history 
    : (data?.download_history ? [] : []);
    
  const lastDownloadDate = data?.last_download_date;
  let downloadsToday = data?.downloads_today || 0;

  // Verificar se precisamos resetar o contador diário
  const today = new Date().toISOString().split('T')[0];
  const lastDate = lastDownloadDate ? new Date(lastDownloadDate).toISOString().split('T')[0] : null;

  if (lastDate !== today) {
    downloadsToday = 0; // Resetar o contador se for um novo dia
  }

  // Adicionar o novo download ao histórico
  const newDownload = {
    template_id: templateId,
    template_name: templateName,
    downloaded_at: new Date().toISOString()
  };

  const updatedHistory = [...downloadHistory, newDownload];
  downloadsToday += 1;

  // Atualizar o perfil com os novos dados de download
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      download_history: updatedHistory,
      last_download_date: new Date().toISOString(),
      downloads_today: downloadsToday
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating user download history:', updateError);
    return false;
  }

  return true;
}
