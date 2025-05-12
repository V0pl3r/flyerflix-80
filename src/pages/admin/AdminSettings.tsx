
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Save, Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Flyerflix",
    siteDescription: "Plataforma de templates para eventos e festas",
    contactEmail: "contato@flyerflix.com",
    contactPhone: "+55 (11) 99999-9999",
    logo: "/placeholder.svg",
  });

  const [planSettings, setPlanSettings] = useState({
    freePlan: {
      downloadsPerDay: 2,
      active: true,
    },
    ultimatePlan: {
      monthlyPrice: 23.90,
      annualPrice: 215.40,
      active: true,
    }
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    smtp: {
      host: "smtp.provider.com",
      port: 587,
      username: "notifications@flyerflix.com",
      password: "********",
      enabled: true,
    },
    payment: {
      provider: "stripe",
      apiKey: "sk_test_***********************",
      webhookSecret: "whsec_**********************",
      enabled: true,
    },
    analytics: {
      googleTrackingId: "UA-123456789-1",
      enabled: true,
    }
  });

  const [socialSettings, setSocialSettings] = useState({
    instagram: "https://instagram.com/flyerflix",
    facebook: "https://facebook.com/flyerflix",
    twitter: "https://twitter.com/flyerflix",
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlanChange = (field: string, value: number | boolean) => {
    if (field === "downloadsPerDay") {
      setPlanSettings({
        ...planSettings,
        freePlan: {
          ...planSettings.freePlan,
          downloadsPerDay: value as number,
        },
      });
    } else if (field === "monthlyPrice" || field === "annualPrice") {
      setPlanSettings({
        ...planSettings,
        ultimatePlan: {
          ...planSettings.ultimatePlan,
          [field]: value as number,
        },
      });
    } else if (field === "freePlanActive" || field === "ultimatePlanActive") {
      const planType = field === "freePlanActive" ? "freePlan" : "ultimatePlan";
      setPlanSettings({
        ...planSettings,
        [planType]: {
          ...planSettings[planType as keyof typeof planSettings],
          active: value as boolean,
        },
      });
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialSettings({
      ...socialSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveSettings = (section: string) => {
    toast("Configurações Salvas", {
      description: `As configurações de ${section} foram salvas com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Configurações</h2>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#222222] border-b border-gray-800 rounded-none justify-start w-full h-auto mb-4 p-0">
          <TabsTrigger 
            value="general"
            className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-[#ea384c] data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-white py-3"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="plans"
            className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-[#ea384c] data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-white py-3"
          >
            Planos e Preços
          </TabsTrigger>
          <TabsTrigger 
            value="integrations"
            className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-[#ea384c] data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-white py-3"
          >
            Integrações
          </TabsTrigger>
          <TabsTrigger 
            value="social"
            className="rounded-t-lg border-b-2 border-transparent data-[state=active]:border-[#ea384c] data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-white py-3"
          >
            Redes Sociais
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="bg-[#222222] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Configurações Gerais</CardTitle>
              <CardDescription className="text-gray-400">
                Defina as informações básicas da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-white">Nome do Site</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-white">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={generalSettings.logo}
                    onChange={handleGeneralChange}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-white">Descrição</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  className="bg-[#1A1F2C] border-gray-700 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-white">
                    <Mail className="inline-block h-4 w-4 mr-1" />
                    Email de Contato
                  </Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-white">
                    <Phone className="inline-block h-4 w-4 mr-1" />
                    Telefone de Contato
                  </Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralChange}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings("Geral")} className="bg-[#ea384c] hover:bg-[#ea384c]/80 mt-4">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <Card className="bg-[#222222] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Planos e Preços</CardTitle>
              <CardDescription className="text-gray-400">
                Configure os planos disponíveis e seus valores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plano Gratuito */}
              <div className="border border-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Plano Gratuito</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={planSettings.freePlan.active} 
                      onCheckedChange={(checked) => handlePlanChange("freePlanActive", checked)}
                    />
                    <Label className="text-gray-400">{planSettings.freePlan.active ? "Ativo" : "Inativo"}</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="downloadsPerDay" className="text-white">Downloads diários permitidos</Label>
                  <Input
                    id="downloadsPerDay"
                    type="number"
                    value={planSettings.freePlan.downloadsPerDay}
                    onChange={(e) => handlePlanChange("downloadsPerDay", parseInt(e.target.value, 10))}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
              </div>
              
              {/* Plano Ultimate */}
              <div className="border border-gray-800 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Plano Ultimate</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={planSettings.ultimatePlan.active} 
                      onCheckedChange={(checked) => handlePlanChange("ultimatePlanActive", checked)}
                    />
                    <Label className="text-gray-400">{planSettings.ultimatePlan.active ? "Ativo" : "Inativo"}</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyPrice" className="text-white">Preço Mensal (R$)</Label>
                    <Input
                      id="monthlyPrice"
                      type="number"
                      value={planSettings.ultimatePlan.monthlyPrice}
                      onChange={(e) => handlePlanChange("monthlyPrice", parseFloat(e.target.value))}
                      className="bg-[#1A1F2C] border-gray-700 text-white"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualPrice" className="text-white">Preço Anual (R$)</Label>
                    <Input
                      id="annualPrice"
                      type="number"
                      value={planSettings.ultimatePlan.annualPrice}
                      onChange={(e) => handlePlanChange("annualPrice", parseFloat(e.target.value))}
                      className="bg-[#1A1F2C] border-gray-700 text-white"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings("Planos")} className="bg-[#ea384c] hover:bg-[#ea384c]/80">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card className="bg-[#222222] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Integrações</CardTitle>
              <CardDescription className="text-gray-400">
                Configure as integrações com serviços externos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium text-white">Serviços Integrados</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Provedor de Email (SMTP)</h4>
                    <p className="text-gray-400 text-sm">{integrationSettings.smtp.host}:{integrationSettings.smtp.port}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={integrationSettings.smtp.enabled} />
                    <span className="text-gray-400">{integrationSettings.smtp.enabled ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Pagamento ({integrationSettings.payment.provider})</h4>
                    <p className="text-gray-400 text-sm">API Key: {integrationSettings.payment.apiKey.substring(0, 8)}...</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={integrationSettings.payment.enabled} />
                    <span className="text-gray-400">{integrationSettings.payment.enabled ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Google Analytics</h4>
                    <p className="text-gray-400 text-sm">{integrationSettings.analytics.googleTrackingId}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={integrationSettings.analytics.enabled} />
                    <span className="text-gray-400">{integrationSettings.analytics.enabled ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSaveSettings("Integrações")} className="bg-[#ea384c] hover:bg-[#ea384c]/80">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card className="bg-[#222222] border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Redes Sociais</CardTitle>
              <CardDescription className="text-gray-400">
                Configure os links para as redes sociais do Flyerflix.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Instagram className="text-[#ea384c]" />
                  <Label htmlFor="instagram" className="text-white">Instagram</Label>
                </div>
                <Input
                  id="instagram"
                  name="instagram"
                  value={socialSettings.instagram}
                  onChange={handleSocialChange}
                  className="bg-[#1A1F2C] border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Facebook className="text-[#ea384c]" />
                  <Label htmlFor="facebook" className="text-white">Facebook</Label>
                </div>
                <Input
                  id="facebook"
                  name="facebook"
                  value={socialSettings.facebook}
                  onChange={handleSocialChange}
                  className="bg-[#1A1F2C] border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Twitter className="text-[#ea384c]" />
                  <Label htmlFor="twitter" className="text-white">Twitter</Label>
                </div>
                <Input
                  id="twitter"
                  name="twitter"
                  value={socialSettings.twitter}
                  onChange={handleSocialChange}
                  className="bg-[#1A1F2C] border-gray-700 text-white"
                />
              </div>
              
              <Button onClick={() => handleSaveSettings("Redes Sociais")} className="bg-[#ea384c] hover:bg-[#ea384c]/80 mt-4">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
