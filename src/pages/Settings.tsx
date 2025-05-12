
import { useState, useEffect } from 'react';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Infinity } from 'lucide-react';

type UserType = {
  name: string;
  email: string;
  plan: string;
  downloads: number;
  maxDownloads: number | 'unlimited';
};

const Settings = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [emailPreferences, setEmailPreferences] = useState({
    newTemplates: true,
    tips: false,
    promotions: true
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    const userData = localStorage.getItem('flyerflix-user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setProfileData({
        ...profileData,
        name: parsedUser.name,
        email: parsedUser.email
      });
    }
  }, []);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    if (user) {
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email
      };
      
      localStorage.setItem('flyerflix-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    }
  };
  
  const handleEmailPrefChange = (key: keyof typeof emailPreferences, value: boolean) => {
    setEmailPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Preferências atualizadas",
      description: "Suas preferências de e-mail foram atualizadas."
    });
  };
  
  const handleUpgrade = () => {
    toast({
      title: "Upgrade em breve!",
      description: "Estamos preparando essa funcionalidade."
    });
  };
  
  const handleDowngrade = () => {
    toast({
      title: "Downgrade em breve!",
      description: "Estamos preparando essa funcionalidade."
    });
  };
  
  const handleDeleteAccount = () => {
    const confirm = window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");
    
    if (confirm) {
      localStorage.removeItem('flyerflix-user');
      localStorage.removeItem('flyerflix-welcome-seen');
      localStorage.removeItem('flyerflix-visited-dashboard');
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso."
      });
      
      // Redirect to home after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  if (!user) return null;

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Configurações da Conta</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Informações Pessoais</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="bg-[#333] border-[#444] text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="bg-[#333] border-[#444] text-white"
                  />
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-bold mb-3">Alterar senha</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1">
                        Senha atual
                      </label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={profileData.password}
                        onChange={handleProfileChange}
                        className="bg-[#333] border-[#444] text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-white/70 mb-1">
                        Nova senha
                      </label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={handleProfileChange}
                        className="bg-[#333] border-[#444] text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1">
                        Confirmar nova senha
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={handleProfileChange}
                        className="bg-[#333] border-[#444] text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-flyerflix-red hover:bg-red-700">
                    Salvar Alterações
                  </Button>
                </div>
              </form>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-red-500 mb-2">Zona de Perigo</h3>
                <p className="text-white/70 text-sm mb-4">
                  Excluir sua conta removerá permanentemente todos os seus dados.
                </p>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={handleDeleteAccount}
                >
                  Excluir minha conta
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription" className="mt-6">
            <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Seu plano atual</h2>
                <Badge variant="default" className={`font-medium text-white ${
                  user.plan === 'ultimate' ? 'bg-flyerflix-red' : 'bg-white/20'
                }`}>
                  {user.plan === 'ultimate' ? 'Plano Ultimate' : 'Plano Grátis'}
                </Badge>
              </div>
              
              {user.plan === 'free' ? (
                <div>
                  <div className="bg-[#222] rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-2">Plano Grátis</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        2 downloads por dia
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Acesso a templates básicos
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Marca d'água nos downloads
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#2a1b1b] to-[#1e1e1e] rounded-lg p-6 border border-flyerflix-red/30">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-1">Upgrade para Ultimate</h3>
                        <p className="text-white/70 mb-4">Acesso completo a todos os templates por R$23,90/mês</p>
                        
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-2 text-flyerflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Downloads ilimitados
                          </li>
                          <li className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-2 text-flyerflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Acesso a todos os templates premium
                          </li>
                          <li className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-2 text-flyerflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Sem marca d'água
                          </li>
                        </ul>
                        
                        <Button 
                          className="bg-flyerflix-red hover:bg-red-700 w-full md:w-auto"
                          onClick={handleUpgrade}
                        >
                          Fazer upgrade agora
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-gradient-to-r from-[#2a1b1b] to-[#1e1e1e] rounded-lg p-4 mb-6 border border-flyerflix-red/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          Plano Ultimate 
                          <span className="inline-flex items-center ml-2 text-xs bg-flyerflix-red/20 text-flyerflix-red px-2 py-0.5 rounded-full">
                            Ativo
                          </span>
                        </h3>
                        <p className="text-white/70 text-sm mt-1">Renovação em 15/06/2025</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">R$23,90/mês</div>
                        <div className="flex items-center text-white/70 text-sm mt-1">
                          <Infinity size={14} className="mr-1" />
                          Downloads ilimitados
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10"
                        onClick={() => toast({
                          title: "Faturamento em breve!",
                          description: "Esta funcionalidade estará disponível em breve."
                        })}
                      >
                        Gerenciar pagamento
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="text-white/70 border-white/20 hover:bg-white/10"
                        onClick={handleDowngrade}
                      >
                        Cancelar assinatura
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-[#222] p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Benefícios do seu plano</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Downloads ilimitados
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Acesso a todos os templates premium
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Sem marca d'água
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Acesso antecipado às novidades
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Integração com Canva
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Preferências de E-mail</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Novos templates</h3>
                    <p className="text-sm text-white/70">Receba notificações quando novos templates forem adicionados.</p>
                  </div>
                  <Switch 
                    checked={emailPreferences.newTemplates} 
                    onCheckedChange={(checked) => handleEmailPrefChange('newTemplates', checked)} 
                    className="data-[state=checked]:bg-flyerflix-red"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <h3 className="font-medium">Dicas de design</h3>
                    <p className="text-sm text-white/70">Receba dicas e tutoriais para melhorar seus designs.</p>
                  </div>
                  <Switch 
                    checked={emailPreferences.tips} 
                    onCheckedChange={(checked) => handleEmailPrefChange('tips', checked)}
                    className="data-[state=checked]:bg-flyerflix-red"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <h3 className="font-medium">Promoções e ofertas especiais</h3>
                    <p className="text-sm text-white/70">Receba informações sobre promoções e ofertas exclusivas.</p>
                  </div>
                  <Switch 
                    checked={emailPreferences.promotions} 
                    onCheckedChange={(checked) => handleEmailPrefChange('promotions', checked)}
                    className="data-[state=checked]:bg-flyerflix-red"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MemberLayout>
  );
};

export default Settings;
