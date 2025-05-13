
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Check, Save, Plus, Trash } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Benefit {
  id: string;
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  featured: boolean;
  benefits: Benefit[];
  active: boolean;
}

const AdminPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "free",
      name: "Grátis",
      price: "R$0",
      period: "",
      description: "Ideal para explorar a plataforma",
      buttonText: "Começar agora",
      buttonLink: "/register",
      featured: false,
      active: true,
      benefits: [
        { id: "f1", text: "2 downloads por dia", included: true },
        { id: "f2", text: "Acesso a templates básicos", included: true },
        { id: "f3", text: "Marca d'água nos downloads", included: true },
        { id: "f4", text: "Acesso a todas as categorias", included: false },
        { id: "f5", text: "Downloads ilimitados", included: false },
        { id: "f6", text: "Integração com Canva", included: false },
      ]
    },
    {
      id: "ultimate",
      name: "Ultimate",
      price: "R$23,90",
      period: "/mês",
      description: "Acesso completo à plataforma",
      buttonText: "Assinar agora",
      buttonLink: "https://stripe.com/checkout/flyerflix-ultimate",
      featured: true,
      active: true,
      benefits: [
        { id: "u1", text: "Downloads ilimitados", included: true },
        { id: "u2", text: "Acesso a todos os templates", included: true },
        { id: "u3", text: "Sem marca d'água", included: true },
        { id: "u4", text: "Acesso antecipado às novidades", included: true },
        { id: "u5", text: "Templates exclusivos", included: true },
        { id: "u6", text: "Integração com Canva", included: true },
      ]
    }
  ]);

  // Function to update plan data
  const handlePlanChange = (planId: string, field: keyof Plan, value: any) => {
    setPlans(plans.map(plan => 
      plan.id === planId
        ? { ...plan, [field]: value }
        : plan
    ));
  };

  // Function to update a benefit
  const handleBenefitChange = (planId: string, benefitId: string, field: keyof Benefit, value: any) => {
    setPlans(plans.map(plan => 
      plan.id === planId
        ? {
            ...plan,
            benefits: plan.benefits.map(benefit =>
              benefit.id === benefitId
                ? { ...benefit, [field]: value }
                : benefit
            )
          }
        : plan
    ));
  };

  // Function to add a new benefit
  const addBenefit = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId
        ? {
            ...plan,
            benefits: [
              ...plan.benefits,
              {
                id: `${planId}-${Date.now()}`,
                text: "",
                included: true
              }
            ]
          }
        : plan
    ));
  };

  // Function to remove a benefit
  const removeBenefit = (planId: string, benefitId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId
        ? {
            ...plan,
            benefits: plan.benefits.filter(benefit => benefit.id !== benefitId)
          }
        : plan
    ));
  };

  // Function to save changes
  const saveChanges = () => {
    // In a real application, you would save this to a database
    // For now, we'll just show a toast notification
    toast("Sucesso", { 
      description: "Planos atualizados com sucesso. As alterações já estão disponíveis na página inicial." 
    });

    // You would also update the pricing section on the home page
    // This would usually be done through an API call or context
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Planos e Preços</h2>
        <Button
          onClick={saveChanges}
          className="bg-[#ea384c] hover:bg-[#ea384c]/80"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="bg-[#222222] border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">Configurações do plano</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={plan.active}
                    onCheckedChange={(checked) => handlePlanChange(plan.id, "active", checked)}
                  />
                  <span className="text-sm text-gray-400">
                    {plan.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${plan.id}-name`} className="text-white">Nome do plano</Label>
                  <Input
                    id={`${plan.id}-name`}
                    value={plan.name}
                    onChange={(e) => handlePlanChange(plan.id, "name", e.target.value)}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${plan.id}-price`} className="text-white">Preço</Label>
                  <Input
                    id={`${plan.id}-price`}
                    value={plan.price}
                    onChange={(e) => handlePlanChange(plan.id, "price", e.target.value)}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${plan.id}-period`} className="text-white">Período (ex: /mês)</Label>
                  <Input
                    id={`${plan.id}-period`}
                    value={plan.period}
                    onChange={(e) => handlePlanChange(plan.id, "period", e.target.value)}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${plan.id}-featured`} className="text-white">Destaque</Label>
                  <div className="flex items-center h-10 space-x-2">
                    <Switch 
                      id={`${plan.id}-featured`}
                      checked={plan.featured}
                      onCheckedChange={(checked) => handlePlanChange(plan.id, "featured", checked)}
                    />
                    <span className="text-sm text-gray-400">
                      {plan.featured ? "Em destaque" : "Normal"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${plan.id}-description`} className="text-white">Descrição</Label>
                <Textarea
                  id={`${plan.id}-description`}
                  value={plan.description}
                  onChange={(e) => handlePlanChange(plan.id, "description", e.target.value)}
                  className="bg-[#1A1F2C] border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${plan.id}-button-text`} className="text-white">Texto do botão</Label>
                  <Input
                    id={`${plan.id}-button-text`}
                    value={plan.buttonText}
                    onChange={(e) => handlePlanChange(plan.id, "buttonText", e.target.value)}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${plan.id}-button-link`} className="text-white">Link do botão</Label>
                  <Input
                    id={`${plan.id}-button-link`}
                    value={plan.buttonLink}
                    onChange={(e) => handlePlanChange(plan.id, "buttonLink", e.target.value)}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                    placeholder="/register ou https://"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${plan.id}-benefits`} className="text-white">Benefícios</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addBenefit(plan.id)}
                    className="h-8 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                {plan.benefits.map((benefit) => (
                  <div key={benefit.id} className="flex items-center space-x-2">
                    <Switch 
                      checked={benefit.included}
                      onCheckedChange={(checked) => 
                        handleBenefitChange(plan.id, benefit.id, "included", checked)
                      }
                    />
                    <Input
                      value={benefit.text}
                      onChange={(e) => 
                        handleBenefitChange(plan.id, benefit.id, "text", e.target.value)
                      }
                      className="bg-[#1A1F2C] border-gray-700 text-white flex-1"
                      placeholder="Descrição do benefício"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeBenefit(plan.id, benefit.id)}
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-800/20"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4">
              <div className="text-sm text-gray-400">
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Alterações na página inicial são automáticas</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPlans;
