
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  plan: 'free' | 'ultimate';
  downloads_today: number;
  last_download_date?: string;
  favorites: string[];
  download_history: DownloadHistory[];
  created_at?: string;
  updated_at?: string;
}

export interface DownloadHistory {
  template_id: string;
  template_name: string;
  downloaded_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
  return data as UserProfile;
}

export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  // Add updated_at timestamp
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updatedData)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
  
  return data as UserProfile;
}

export async function createUserProfile(
  userId: string,
  email: string,
  name?: string
): Promise<UserProfile | null> {
  const newProfile = {
    id: userId,
    email,
    name: name || '',
    plan: 'free' as const,
    downloads_today: 0,
    favorites: [],
    download_history: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single();
    
  if (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
  
  return data as UserProfile;
}

export async function addFavoriteTemplate(
  userId: string,
  templateId: string
): Promise<boolean> {
  // First get current favorites
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('favorites')
    .eq('id', userId)
    .single();
    
  if (fetchError) {
    console.error("Error fetching favorites:", fetchError);
    return false;
  }
  
  // Update favorites array
  const currentFavorites = profile.favorites || [];
  
  // Only add if not already in favorites
  if (!currentFavorites.includes(templateId)) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        favorites: [...currentFavorites, templateId],
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error adding favorite:", updateError);
      return false;
    }
  }
  
  return true;
}

export async function removeFavoriteTemplate(
  userId: string,
  templateId: string
): Promise<boolean> {
  // First get current favorites
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('favorites')
    .eq('id', userId)
    .single();
    
  if (fetchError) {
    console.error("Error fetching favorites:", fetchError);
    return false;
  }
  
  // Update favorites array
  const currentFavorites = profile.favorites || [];
  const updatedFavorites = currentFavorites.filter(id => id !== templateId);
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      favorites: updatedFavorites,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error("Error removing favorite:", updateError);
    return false;
  }
  
  return true;
}

export async function recordTemplateDownload(
  userId: string,
  templateId: string,
  templateName: string
): Promise<boolean> {
  // Get current profile data
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('download_history, downloads_today, last_download_date')
    .eq('id', userId)
    .single();
    
  if (fetchError) {
    console.error("Error fetching download history:", fetchError);
    return false;
  }
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const currentDownloadHistory = profile.download_history || [];
  const lastDownloadDate = profile.last_download_date?.split('T')[0];
  
  // Reset daily counter if it's a new day
  let downloadsToday = profile.downloads_today || 0;
  if (lastDownloadDate !== today) {
    downloadsToday = 0;
  }
  
  // Add new download record
  const newDownload = {
    template_id: templateId,
    template_name: templateName,
    downloaded_at: new Date().toISOString()
  };
  
  // Update profile with new download
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      downloads_today: downloadsToday + 1,
      last_download_date: new Date().toISOString(),
      download_history: [...currentDownloadHistory, newDownload],
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error("Error recording download:", updateError);
    return false;
  }
  
  return true;
}
