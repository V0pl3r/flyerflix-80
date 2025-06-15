
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BadgeCheck, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfile, updateUserProfile, UserProfile } from '@/models/UserProfile';
import { toast } from '@/components/ui/sonner';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    if (user && open) {
      loadUserProfile();
    }
  }, [user, open]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let userProfile = await fetchUserProfile(user.id);
      
      // Se o perfil não existir, criar um novo
      if (!userProfile) {
        const newProfile: Partial<UserProfile> = {
          id: user.id,
          email: user.email,
          name: user.name || user.email?.split('@')[0] || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          avatar_url: user.user_metadata?.avatar_url || user.avatarUrl,
          plan: user.plan || 'free',
          role: 'user',
          is_admin: false,
          user_id: user.id
        };
        
        userProfile = await updateUserProfile(newProfile);
      }
      
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          name: userProfile.name || '',
          email: userProfile.email || '',
          first_name: userProfile.first_name || '',
          last_name: userProfile.last_name || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      const updatedProfile = await updateUserProfile({
        ...profile,
        name: formData.name,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name
      });

      if (updatedProfile) {
        setProfile(updatedProfile);
        
        // Atualizar dados no contexto de autenticação
        updateUser({
          name: updatedProfile.name,
          email: updatedProfile.email
        });
        
        setIsEditing(false);
        toast.success('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Seu Perfil
            {!isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 text-white/70 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={loading}
                  className="h-8 w-8 text-green-400 hover:text-green-300"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {isEditing ? 'Edite suas informações de perfil' : 'Visualize suas informações de perfil'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-flyerflix-red">
              <AvatarImage src={profile?.avatar_url || user.avatarUrl} alt={profile?.name || user.name} className="object-cover" />
              <AvatarFallback className="bg-flyerflix-black text-flyerflix-red text-lg">
                {(profile?.name || user.name)?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {!isEditing ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">{profile?.name || user.name}</h3>
                <p className="text-white/70 mt-1">{profile?.email || user.email}</p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Seu email"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-white">Primeiro Nome</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Primeiro nome"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-white">Último Nome</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Último nome"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <BadgeCheck className={`h-5 w-5 ${(profile?.plan || user.plan) === 'ultimate' ? 'text-flyerflix-red' : 'text-gray-500'}`} />
              <span className={`text-sm ${(profile?.plan || user.plan) === 'ultimate' ? 'text-flyerflix-red' : 'text-gray-500'}`}>
                {(profile?.plan || user.plan) === 'ultimate' ? 'Assinante Ultimate' : 'Plano Gratuito'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
