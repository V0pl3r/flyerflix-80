
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BadgeCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfile } from '@/models/UserProfile';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const { user, session } = useAuth();
  
  useEffect(() => {
    // Fetch updated user profile when modal opens
    const loadUserProfile = async () => {
      if (session?.user?.id && open) {
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            console.log('Profile loaded:', profile);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [session?.user?.id, open]);
  
  if (!user) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seu Perfil</DialogTitle>
          <DialogDescription className="text-white/70">
            Visualize suas informações de perfil
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-flyerflix-red">
              <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
              <AvatarFallback className="bg-flyerflix-black text-flyerflix-red text-lg">
                {user.name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">{user.name || user.email?.split('@')[0]}</h3>
              <p className="text-white/70 mt-1">{user.email}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <BadgeCheck className={`h-5 w-5 ${user.plan === 'ultimate' ? 'text-flyerflix-red' : 'text-gray-500'}`} />
              <span className={`text-sm ${user.plan === 'ultimate' ? 'text-flyerflix-red' : 'text-gray-500'}`}>
                {user.plan === 'ultimate' ? 'Assinante Ultimate' : 'Plano Gratuito'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
