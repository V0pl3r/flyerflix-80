
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

interface AdminLoginDialogProps {
  open: boolean;
  isLoading: boolean;
  adminEmail: string;
  adminPassword: string;
  onOpenChange: (open: boolean) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
}

const AdminLoginDialog = ({
  open,
  isLoading,
  adminEmail,
  adminPassword,
  onOpenChange,
  onEmailChange,
  onPasswordChange,
  onLogin
}: AdminLoginDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={16} /> Login Administrativo
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Acesse o painel de administração da Flyerflix
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input 
              id="admin-email" 
              type="email" 
              value={adminEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              className="bg-[#2a2a2a] border-white/10"
              placeholder="admin@flyerflix.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admin-password">Senha</Label>
            <Input 
              id="admin-password" 
              type="password" 
              value={adminPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="bg-[#2a2a2a] border-white/10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-white/20 hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onLogin}
            className="bg-flyerflix-red hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
