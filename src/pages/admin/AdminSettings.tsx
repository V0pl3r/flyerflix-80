
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Plus, Edit, Trash, Instagram, Facebook, Twitter } from 'lucide-react';

const AdminSettings = () => {
  const [currentTab, setCurrentTab] = useState('general');
  
  // Mock data for plans
  const [plans, setPlans] = useState([
    { id: '1', name: 'Grátis', price: '0', features: ['2 downloads diários', 'Acesso a templates básicos'], isActive: true },
    { id: '2', name: 'Ultimate', price: '23.90', features: ['Downloads ilimitados', 'Acesso a todos os templates', 'Prioridade no suporte'], isActive: true },
  ]);
  
  // Form schema for platform settings
  const platformFormSchema = z.object({
    platformName: z.string().min(2, { message: 'O nome da plataforma é obrigatório' }),
    logoUrl: z.string().url({ message: 'Insira uma URL válida para o logo' }).or(z.literal('')),
    primaryColor: z.string(),
    freeDownloadLimit: z.string().transform(value => Number(value)),
    instagramUrl: z.string().url({ message: 'Insira uma URL válida para o Instagram' }).or(z.literal('')),
    facebookUrl: z.string().url({ message: 'Insira uma URL válida para o Facebook' }).or(z.literal('')),
    twitterUrl: z.string().url({ message: 'Insira uma URL válida para o Twitter' }).or(z.literal('')),
  });
  
  // Form schema for email settings
  const emailFormSchema = z.object({
    smtpServer: z.string().min(1, { message: 'O servidor SMTP é obrigatório' }),
    smtpPort: z.string().transform(value => Number(value)),
    smtpUser: z.string().min(1, { message: 'O usuário SMTP é obrigatório' }),
    smtpPassword: z.string().min(1, { message: 'A senha SMTP é obrigatória' }),
    senderEmail: z.string().email({ message: 'Insira um email válido' }),
    senderName: z.string().min(1, { message: 'O nome do remetente é obrigatório' }),
  });
  
  // Form schema for plan settings
  const planFormSchema = z.object({
    name: z.string().min(1, { message: 'O nome do plano é obrigatório' }),
    price: z.string(),
    feature1: z.string(),
    feature2: z.string(),
    feature3: z.string().optional(),
    feature4: z.string().optional(),
    isActive: z.boolean().default(true),
  });
  
  // Initialize forms
  const platformForm = useForm<z.infer<typeof platformFormSchema>>({
    resolver: zodResolver(platformFormSchema),
    defaultValues: {
      platformName: 'Flyerflix',
      logoUrl: 'https://flyerflix.com/logo.png',
      primaryColor: '#ea384c',
      freeDownloadLimit: '2',
      instagramUrl: 'https://instagram.com/flyerflix',
      facebookUrl: 'https://facebook.com/flyerflix',
      twitterUrl: '',
    },
  });
  
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      smtpServer: 'smtp.sendgrid.net',
      smtpPort: '587',
      smtpUser: 'apikey',
      smtpPassword: '••••••••••••••••',
      senderEmail: 'noreply@flyerflix.com',
      senderName: 'Flyerflix',
    },
  });
  
  const planForm = useForm<z.infer<typeof planFormSchema>>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: '',
      price: '',
      feature1: '',
      feature2: '',
      feature3: '',
      feature4: '',
      isActive: true,
    },
  });
  
  // Submit handlers
  const onSubmitPlatform = (data: z.infer<typeof platformFormSchema>) => {
    console.log('Plataform settings saved:', data);
    // Here you would typically update the settings in your backend
  };
  
  const onSubmitEmail = (data: z.infer<typeof emailFormSchema>) => {
    console.log('Email settings saved:', data);
    // Here you would typically update the email settings in your backend
  };
  
  const onSubmitPlan = (data: z.infer<typeof planFormSchema>) => {
    // Extract features from form data
    const features = [
      data.feature1,
      data.feature2,
      ...(data.feature3 ? [data.feature3] : []),
      ...(data.feature4 ? [data.feature4] : []),
    ].filter(Boolean);
    
    const newPlan = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      price: data.price,
      features,
      isActive: data.isActive,
    };
    
    setPlans([...plans, newPlan]);
    planForm.reset();
  };
  
  const handleDeletePlan = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };
  
  const handleEditPlan = (plan: any) => {
    // Here you would typically open a dialog to edit the plan
    console.log('Edit plan:', plan);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>
      
      <Tabs 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="mb-8"
      >
        <TabsList className="bg-[#1A1F2C] border-b border-gray-800 rounded-none p-0 h-auto w-full justify-start">
          <TabsTrigger 
            value="general" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="email" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Email
          </TabsTrigger>
          <TabsTrigger 
            value="plans" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Planos
          </TabsTrigger>
          <TabsTrigger 
            value="integrations" 
            className="py-3 px-6 rounded-t-lg data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Integrações
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="mt-6">
          <Form {...platformForm}>
            <form onSubmit={platformForm.handleSubmit(onSubmitPlatform)} className="space-y-6">
              <Card className="bg-[#222222] border-none">
                <CardHeader>
                  <CardTitle className="text-xl">Configurações da Plataforma</CardTitle>
                  <CardDescription>
                    Configure as informações básicas da sua plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={platformForm.control}
                      name="platformName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Plataforma</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="Nome da plataforma" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={platformForm.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Logo</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="https://..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={platformForm.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor Primária</FormLabel>
                          <div className="flex gap-3">
                            <input 
                              type="color"
                              className="w-10 h-10 rounded border border-gray-800"
                              {...field}
                            />
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800 flex-1" 
                                {...field} 
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={platformForm.control}
                      name="freeDownloadLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limite de Downloads (Plano Grátis)</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              type="number"
                              min="0"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-3">Redes Sociais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={platformForm.control}
                        name="instagramUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Instagram size={16} /> Instagram
                            </FormLabel>
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800" 
                                placeholder="https://instagram.com/..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={platformForm.control}
                        name="facebookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Facebook size={16} /> Facebook
                            </FormLabel>
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800" 
                                placeholder="https://facebook.com/..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={platformForm.control}
                        name="twitterUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Twitter size={16} /> Twitter
                            </FormLabel>
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800" 
                                placeholder="https://twitter.com/..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-[#ea384c] hover:bg-[#d02d3f] gap-2">
                  <Save size={16} /> Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        {/* Email Settings Tab */}
        <TabsContent value="email" className="mt-6">
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
              <Card className="bg-[#222222] border-none">
                <CardHeader>
                  <CardTitle className="text-xl">Configurações de Email</CardTitle>
                  <CardDescription>
                    Configure o servidor de email para envio de notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Servidor SMTP</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="ex: smtp.gmail.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porta SMTP</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="ex: 587" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="smtpUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário SMTP</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="Usuário ou API key" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha SMTP</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              type="password"
                              placeholder="Senha ou API secret" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email do Remetente</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="noreply@seudominio.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Remetente</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="Nome da sua empresa" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-3">Testar Configuração</h3>
                    <div className="flex gap-3">
                      <Input 
                        className="bg-[#1A1F2C] border-gray-800" 
                        placeholder="Email para teste" 
                      />
                      <Button variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-[#1A1F2C]">
                        Enviar Email de Teste
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#222222] border-none">
                <CardHeader>
                  <CardTitle className="text-xl">Modelos de Email</CardTitle>
                  <CardDescription>
                    Personalize os modelos de email enviados para seus usuários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-700 rounded-lg p-4 hover:bg-[#1A1F2C] cursor-pointer transition-colors">
                      <h3 className="font-medium mb-1">Bem-vindo</h3>
                      <p className="text-sm text-gray-400">Email enviado quando um usuário se cadastra</p>
                    </div>
                    
                    <div className="border border-gray-700 rounded-lg p-4 hover:bg-[#1A1F2C] cursor-pointer transition-colors">
                      <h3 className="font-medium mb-1">Recuperação de Senha</h3>
                      <p className="text-sm text-gray-400">Email enviado para redefinir a senha</p>
                    </div>
                    
                    <div className="border border-gray-700 rounded-lg p-4 hover:bg-[#1A1F2C] cursor-pointer transition-colors">
                      <h3 className="font-medium mb-1">Assinatura Confirmada</h3>
                      <p className="text-sm text-gray-400">Email enviado após pagamento confirmado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-[#ea384c] hover:bg-[#d02d3f] gap-2">
                  <Save size={16} /> Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        {/* Plans Tab */}
        <TabsContent value="plans" className="mt-6">
          <Card className="bg-[#222222] border-none mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Planos Disponíveis</CardTitle>
              <CardDescription>
                Gerencie os planos e preços disponíveis para seus usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[#1A1F2C]">
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço (R$)</TableHead>
                    <TableHead>Recursos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-[#1A1F2C]">
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.price === '0' ? 'Grátis' : `R$ ${plan.price}`}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm">{feature}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        {plan.isActive ? (
                          <Badge className="bg-emerald-500">Ativo</Badge>
                        ) : (
                          <Badge className="bg-gray-500">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPlan(plan)}>
                            <Edit size={18} className="text-yellow-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                            <Trash size={18} className="text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="bg-[#222222] border-none">
            <CardHeader>
              <CardTitle className="text-xl">Adicionar Novo Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...planForm}>
                <form onSubmit={planForm.handleSubmit(onSubmitPlan)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={planForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Plano</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="ex: Plano Básico" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={planForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Mensal (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-[#1A1F2C] border-gray-800" 
                              placeholder="ex: 19.90" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-3">Recursos do Plano</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={planForm.control}
                        name="feature1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800" 
                                placeholder="Recurso 1" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={planForm.control}
                        name="feature2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800" 
                                placeholder="Recurso 2" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={planForm.control}
                        name="feature3"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800" 
                                placeholder="Recurso 3 (opcional)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={planForm.control}
                        name="feature4"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                className="bg-[#1A1F2C] border-gray-800" 
                                placeholder="Recurso 4 (opcional)" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={planForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="mt-0 cursor-pointer">Plano Ativo</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Button type="submit" className="bg-[#ea384c] hover:bg-[#d02d3f] gap-2">
                      <Plus size={16} /> Adicionar Plano
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations" className="mt-6">
          <Card className="bg-[#222222] border-none mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Integrações</CardTitle>
              <CardDescription>
                Configure as integrações com ferramentas externas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded">
                        <img src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg" className="w-8 h-8" alt="Google Analytics" />
                      </div>
                      <div>
                        <h3 className="font-medium">Google Analytics</h3>
                        <p className="text-sm text-gray-400">Rastreie o tráfego e comportamento dos usuários</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <Label className="mb-2 block">ID de Acompanhamento</Label>
                    <Input 
                      className="bg-[#1A1F2C] border-gray-800" 
                      placeholder="ex: UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                    />
                  </div>
                </div>
                
                <div className="border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#6772E5] p-2 rounded">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="w-8 h-8" alt="Stripe" />
                      </div>
                      <div>
                        <h3 className="font-medium">Stripe</h3>
                        <p className="text-sm text-gray-400">Processe pagamentos e gerencie assinaturas</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-700">
                    <div>
                      <Label className="mb-2 block">API Key</Label>
                      <Input 
                        className="bg-[#1A1F2C] border-gray-800" 
                        type="password"
                        value="sk_test_••••••••••••••••••••••••"
                      />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Webhook Secret</Label>
                      <Input 
                        className="bg-[#1A1F2C] border-gray-800" 
                        type="password"
                        value="whsec_••••••••••••••••••••••••"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#00C4CC] p-2 rounded">
                        <img src="https://static.canva.com/static/images/canva_logo_100x100@2x.png" className="w-8 h-8" alt="Canva" />
                      </div>
                      <div>
                        <h3 className="font-medium">Canva API</h3>
                        <p className="text-sm text-gray-400">Integre com o Canva para seus templates</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <Label className="mb-2 block">Client ID</Label>
                    <Input 
                      className="bg-[#1A1F2C] border-gray-800" 
                      type="password"
                      value="••••••••••••••••••••••••"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button className="bg-[#ea384c] hover:bg-[#d02d3f] gap-2">
              <Save size={16} /> Salvar Todas as Integrações
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
