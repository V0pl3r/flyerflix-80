
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, BadgeCheck, Upload } from 'lucide-react';

type UserType = {
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | 'unlimited';
  avatarUrl?: string;
};

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    const userData = localStorage.getItem('flyerflix-user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setAvatarUrl(parsedUser.avatarUrl || '');
      setName(parsedUser.name || '');
    }
  }, [open]);
  
  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        name: name,
        avatarUrl: avatarUrl
      };
      
      setUser(updatedUser);
      localStorage.setItem('flyerflix-user', JSON.stringify(updatedUser));
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      onOpenChange(false);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // This is a simple demonstration - in a real app, you'd upload to a server
      // and get back a URL. Here we're just creating a local object URL.
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);
    }
  };
  
  if (!user) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seu Perfil</DialogTitle>
          <DialogDescription className="text-white/70">
            Visualize e edite suas informações de perfil
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-flyerflix-red">
                <AvatarImage src={avatarUrl} alt={user.name} className="object-cover" />
                <AvatarFallback className="bg-flyerflix-black text-flyerflix-red text-lg">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-flyerflix-red text-white p-1.5 rounded-full cursor-pointer"
              >
                <Upload size={14} />
                <span className="sr-only">Upload avatar</span>
              </label>
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <BadgeCheck className={`h-5 w-5 ${user.plan === 'ultimate' ? 'text-flyerflix-red' : 'text-gray-500'}`} />
              <span className={`text-sm ${user.plan === 'ultimate' ? 'text-flyerflix-red' : 'text-gray-500'}`}>
                {user.plan === 'ultimate' ? 'Assinante Ultimate' : 'Plano Gratuito'}
              </span>
            </div>
          </div>
          
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-[#2a2a2a] border-white/10"
              />
            </div>
            
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user.email} 
                disabled 
                className="bg-[#2a2a2a] border-white/10 opacity-70"
              />
              <p className="text-xs text-white/50">O email não pode ser alterado</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-white/20 hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveProfile}
            className="bg-flyerflix-red hover:bg-red-700"
          >
            Salvar alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
