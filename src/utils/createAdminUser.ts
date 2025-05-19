
import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    // First, sign up the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@flyerflix.com',
      password: 'admin123@',
    });

    if (signUpError) {
      console.error('Error creating admin user:', signUpError);
      
      // If error is because user already exists, try to sign in
      if (signUpError.message.includes('already registered')) {
        console.log('Admin user already exists, skipping creation');
        return;
      }
      return null;
    }

    if (signUpData.user) {
      console.log('Admin user created successfully with ID:', signUpData.user.id);
      
      // Update the profile to mark as admin
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: signUpData.user.id,
          email: 'admin@flyerflix.com',
          name: 'Administrator',
          is_admin: true,
          role: 'admin',
          plan: 'ultimate'
        });
        
      if (updateError) {
        console.error('Error updating admin profile:', updateError);
      } else {
        console.log('Admin profile updated successfully');
      }
    }
  } catch (error) {
    console.error('Unexpected error creating admin user:', error);
  }
};
