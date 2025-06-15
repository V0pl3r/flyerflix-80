import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../components/MemberLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Infinity, Upload, Camera, Eye, EyeOff, History, Lock, Bell, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { updateUserProfile } from '@/models/UserProfile';
import { useAuth } from '@/hooks/useAuth';

type ProfileFormData = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, logout } = useAuth();

  const form = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || ''
      });
      if (user.avatarUrl) {
        setUploadedImage(user.avatarUrl);
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate, form]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade em breve!",
      description: "Estamos preparando essa funcionalidade.",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔄 Iniciando upload de imagem...');
    const file = e.target.files?.[0];

    if (!file) {
      console.warn('❌ Nenhum arquivo selecionado.');
      return;
    }

    console.log('📁 Arquivo selecionado:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validações
    if (file.size > MAX_FILE_SIZE) {
      console.warn('❌ Arquivo muito grande:', file.size);
      toast({
        title: "Erro no upload",
        description: "O tamanho máximo permitido é 2MB.",
        variant: "destructive"
      });
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.warn('❌ Tipo de arquivo não suportado:', file.type);
      toast({
        title: "Erro no upload",
        description: "Formato não suportado. Use JPG, PNG ou WebP.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      console.error('❌ ID do usuário não encontrado');
      toast({
        title: "Erro de autenticação",
        description: "Faça login novamente.",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('📤 Fazendo upload para:', fileName);

      // Upload para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('✅ Upload concluído:', uploadData);

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = urlData?.publicUrl;
      console.log('🔗 URL do avatar:', avatarUrl);

      if (!avatarUrl) {
        throw new Error('Não foi possível obter a URL da imagem');
      }

      // Atualizar interface imediatamente
      setUploadedImage(avatarUrl);

      console.log('💾 Atualizando perfil no banco...');
      
      // Atualizar o perfil usando a função do modelo que já lida com as políticas RLS
      const updatedProfile = await updateUserProfile({
        id: user.id,
        avatar_url: avatarUrl
      });

      if (!updatedProfile) {
        throw new Error('Erro ao atualizar perfil no banco de dados');
      }

      console.log('✅ Perfil atualizado:', updatedProfile);

      // Atualizar contexto do usuário
      updateUser({ avatarUrl });

      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso."
      });

    } catch (error: any) {
      console.error('❌ Erro no processo:', error);
      
      // Reverter imagem na interface em caso de erro
      setUploadedImage(user.avatarUrl || null);
      
      toast({
        title: "Erro ao salvar foto de perfil",
        description: error.message || "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingAvatar(false);
      
      // Limpar o input para permitir reenvio do mesmo arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    
    // Validate passwords if user is trying to change password
    if (data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        toast({
          title: "Erro ao atualizar",
          description: "As senhas não coincidem.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (!data.currentPassword) {
        toast({
          title: "Erro ao atualizar",
          description: "Digite sua senha atual para confirmar as alterações.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
    }
    
    try {
      if (user) {
        // Update profile in database
        await updateUserProfile({
          id: user.id,
          name: data.name,
          email: data.email
        });
        
        // Update auth context
        updateUser({ 
          name: data.name,
          email: data.email
        });
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso."
        });
      }
      
      // Reset password fields
      form.setValue('currentPassword', '');
      form.setValue('newPassword', '');
      form.setValue('confirmPassword', '');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <History size={16} />
              <span>Minhas Atividades</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Configurações</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Foto do Perfil</CardTitle>
                  <CardDescription>Sua foto será exibida em seu perfil e comentários</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4 group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-flyerflix-black/50 border-2 border-flyerflix-red flex items-center justify-center">
                      {uploadedImage ? (
                        <img 
                          src={uploadedImage} 
                          alt={user.name || 'Avatar'} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('❌ Erro ao carregar imagem:', uploadedImage);
                            setUploadedImage(null);
                          }}
                        />
                      ) : (
                        <User size={64} className="text-flyerflix-red opacity-70" />
                      )}
                    </div>
                    {!isUploadingAvatar && (
                      <div 
                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera size={32} className="text-white" />
                      </div>
                    )}
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploadingAvatar}
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2"
                    disabled={isUploadingAvatar}
                  >
                    <Upload size={16} />
                    {isUploadingAvatar ? 'Enviando...' : 'Fazer Upload'}
                  </Button>
                  
                  <p className="text-xs text-white/60 mt-3 text-center">
                    Formatos suportados: JPG, PNG, WebP. Tamanho máximo: 2MB
                  </p>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações de perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input 
                                className="bg-[#333] border-[#444] text-white"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input 
                                className="bg-[#333] border-[#444] text-white"
                                type="email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="border-t border-white/10 my-4 pt-4">
                        <h4 className="text-sm font-medium flex items-center gap-1 mb-4">
                          <Lock size={16} />
                          Alterar senha
                        </h4>
                        
                        <FormField
                          control={form.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha atual</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    className="bg-[#333] border-[#444] text-white pr-10"
                                    type={showCurrentPassword ? "text" : "password"}
                                    {...field} 
                                  />
                                  <button 
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    aria-label={showCurrentPassword ? "Esconder senha" : "Mostrar senha"}
                                  >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nova senha</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      className="bg-[#333] border-[#444] text-white pr-10"
                                      type={showNewPassword ? "text" : "password"}
                                      {...field} 
                                    />
                                    <button 
                                      type="button"
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                      aria-label={showNewPassword ? "Esconder senha" : "Mostrar senha"}
                                    >
                                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar nova senha</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      className="bg-[#333] border-[#444] text-white pr-10"
                                      type={showConfirmPassword ? "text" : "password"}
                                      {...field} 
                                    />
                                    <button 
                                      type="button"
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                                    >
                                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Button 
                          variant="outline"
                          className="border-white/20 text-white/70 hover:bg-white/10"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} className="mr-2" />
                          Sair da conta
                        </Button>
                        
                        <Button 
                          type="submit" 
                          className="bg-flyerflix-red hover:bg-red-700"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Salvando...' : 'Salvar alterações'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Seu plano atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="default" className={`font-medium text-white ${
                        user.plan === 'ultimate' ? 'bg-flyerflix-red' : 'bg-white/20'
                      }`}>
                        {user.plan === 'ultimate' ? 'Plano Ultimate' : 'Plano Grátis'}
                      </Badge>
                      {user.plan === 'ultimate' && (
                        <span className="text-green-400 text-xs ml-3">Ativo</span>
                      )}
                    </div>
                    
                    {user.plan === 'free' && (
                      <Button
                        className="bg-flyerflix-red hover:bg-red-700"
                        onClick={handleUpgrade}
                      >
                        Fazer upgrade para Ultimate
                      </Button>
                    )}
                  </div>
                  
                  {user.plan === 'free' ? (
                    <div className="mt-4">
                      <p className="text-sm text-white/70 mb-2">
                        Você tem acesso a 2 downloads por dia e templates básicos.
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                          <span>Downloads hoje</span>
                          <span>0/2</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-flyerflix-red"
                            style={{ width: '0%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm text-white/70 mb-2">
                        Você tem acesso ilimitado a todos os templates.
                      </p>
                      <div className="flex items-center text-white/70 text-sm">
                        <Infinity size={16} className="mr-2" />
                        <span>Downloads ilimitados</span>
                      </div>
                      <p className="text-xs text-white/50 mt-2">
                        Sua assinatura renova em 15/06/2025
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Atividades</CardTitle>
                <CardDescription>Histórico das suas interações na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Últimos Downloads</h3>
                    <div className="space-y-3">
                      <p className="text-white/70 text-sm italic">Nenhum download recente encontrado.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Histórico de Login</h3>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="p-3 border border-white/10 rounded-md bg-[#1e1e1e]">
                        <div className="flex justify-between">
                          <span>Login realizado</span>
                          <span className="text-white/60">Agora mesmo</span>
                        </div>
                        <div className="text-white/60 text-xs mt-1">
                          Navegador: Chrome • Dispositivo: Desktop • IP: 187.XX.XX.XX
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>Gerencie suas preferências e configurações de conta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Globe size={18} />
                      Preferências
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-[#1e1e1e]">
                        <span>Idioma</span>
                        <select className="bg-[#333] border-[#444] text-white py-1 px-2 rounded">
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Bell size={18} />
                      Notificações
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-[#1e1e1e]">
                        <span>E-mails promocionais</span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-flyerflix-red/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-flyerflix-red"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-white/10 rounded-md bg-[#1e1e1e]">
                        <span>Notificações de novos templates</span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-flyerflix-red/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-flyerflix-red"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    className="bg-flyerflix-red hover:bg-red-700"
                  >
                    Salvar preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MemberLayout>
  );
};

export default Profile;
