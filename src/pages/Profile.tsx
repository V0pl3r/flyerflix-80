
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Infinity } from 'lucide-react';

type UserType = {
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | 'unlimited';
};

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('flyerflix-user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('flyerflix-user');
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade em breve!",
      description: "Estamos preparando essa funcionalidade.",
    });
  };

  const handleChangePassword = () => {
    navigate('/configuracoes');
    toast({
      description: "Acesse a aba 'Perfil' para alterar sua senha.",
    });
  };

  if (!user) return null;

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

        <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="bg-flyerflix-red/20 rounded-full p-4">
                <User size={48} className="text-flyerflix-red" />
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-white/70">{user.email}</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-white/20 text-white/70 hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sair da conta
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#252525] rounded-lg p-5 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Seu plano atual</h3>
              <div className="flex items-center mb-4">
                <Badge variant="default" className={`font-medium text-white ${
                  user.plan === 'ultimate' ? 'bg-flyerflix-red' : 'bg-white/20'
                }`}>
                  {user.plan === 'ultimate' ? 'Plano Ultimate' : 'Plano Grátis'}
                </Badge>
                {user.plan === 'ultimate' && (
                  <span className="text-green-400 text-xs ml-3">Ativo</span>
                )}
              </div>

              {user.plan === 'free' ? (
                <>
                  <p className="text-sm text-white/70 mb-4">
                    Você tem acesso a 2 downloads por dia e templates básicos.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>Downloads hoje</span>
                      <span>{user.downloads}/{user.maxDownloads}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-flyerflix-red"
                        style={{ 
                          width: `${Math.min((user.downloads / (user.maxDownloads as number)) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-flyerflix-red hover:bg-red-700"
                    onClick={handleUpgrade}
                  >
                    Fazer upgrade para Ultimate
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-white/70 mb-2">
                    Você tem acesso ilimitado a todos os templates.
                  </p>
                  <div className="flex items-center text-white/70 text-sm mb-4">
                    <Infinity size={16} className="mr-2" />
                    <span>Downloads ilimitados</span>
                  </div>
                  <p className="text-xs text-white/50">
                    Sua assinatura renova em 15/06/2025
                  </p>
                </>
              )}
            </div>

            <div className="bg-[#252525] rounded-lg p-5 border border-white/10">
              <h3 className="text-lg font-medium mb-4">Segurança da conta</h3>
              <p className="text-sm text-white/70 mb-4">
                Gerencie o acesso à sua conta, altere sua senha e configure preferências de segurança.
              </p>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={handleChangePassword}
              >
                Alterar senha
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default Profile;
