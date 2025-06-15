import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    planChoice: 'free'
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast: uiToast
  } = useToast();
  const logoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Animate elements on mount
    const logo = logoRef.current;
    const form = formRef.current;
    if (logo) {
      logo.classList.add('opacity-0', 'scale-90');
      setTimeout(() => {
        logo.classList.remove('opacity-0', 'scale-90');
        logo.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-100', 'scale-100');
      }, 100);
    }
    if (form) {
      form.classList.add('opacity-0', 'translate-y-10');
      setTimeout(() => {
        form.classList.remove('opacity-0', 'translate-y-10');
        form.classList.add('transition-all', 'duration-500', 'ease-out', 'opacity-100', 'translate-y-0');
      }, 400);
    }
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handlePlanChoice = (plan: string) => {
    setFormData(prev => ({
      ...prev,
      planChoice: plan
    }));
  };
  const createCheckoutSession = async () => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      if (error) {
        console.error('Error creating checkout session:', error);
        uiToast({
          title: "Erro ao criar sessão de checkout",
          description: error.message,
          variant: "destructive",
          className: "animate-slide-in-right"
        });
        return null;
      }
      if (data.url) {
        return data.url;
      } else {
        uiToast({
          title: "Erro ao criar sessão de checkout",
          description: "URL de checkout não foi retornada",
          variant: "destructive",
          className: "animate-slide-in-right"
        });
        return null;
      }
    } catch (error: any) {
      console.error('Error in createCheckoutSession:', error);
      uiToast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a criação da sessão de checkout. Tente novamente.",
        variant: "destructive",
        className: "animate-slide-in-right"
      });
      return null;
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      uiToast({
        title: "Erro ao criar conta",
        description: "As senhas não coincidem.",
        variant: "destructive",
        className: "animate-slide-in-right"
      });
      return;
    }
    if (!formData.acceptTerms) {
      uiToast({
        title: "Erro ao criar conta",
        description: "Você precisa aceitar os termos de uso e política de privacidade.",
        variant: "destructive",
        className: "animate-slide-in-right"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Criar conta com Supabase
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            full_name: formData.name
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        console.error('Error creating account:', error);
        uiToast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
          className: "animate-slide-in-right"
        });
        setIsLoading(false);
        return;
      }
      if (data.user) {
        // Se escolheu plano Ultimate, redirecionar para checkout
        if (formData.planChoice === 'ultimate') {
          uiToast({
            title: "Conta criada!",
            description: "Redirecionando para o pagamento...",
            className: "animate-slide-in-right"
          });

          // Aguardar um pouco para garantir que a sessão está criada
          setTimeout(async () => {
            const checkoutUrl = await createCheckoutSession();
            if (checkoutUrl) {
              // Abrir Stripe checkout em nova aba
              window.open(checkoutUrl, '_blank');
              uiToast({
                title: "Abrindo checkout do Stripe...",
                className: "animate-slide-in-right"
              });

              // Redirecionar para dashboard após um delay
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              // Se falhou o checkout, ainda assim vai para dashboard com plano free
              navigate('/dashboard');
            }
          }, 1000);
        } else {
          // Plano gratuito - ir direto para dashboard
          uiToast({
            title: "Conta criada com sucesso!",
            description: "Sua conta gratuita foi criada com sucesso!",
            className: "animate-slide-in-right"
          });
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error during registration:', error);
      uiToast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o registro. Tente novamente.",
        variant: "destructive",
        className: "animate-slide-in-right"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-flyerflix-black flex flex-col items-center justify-center p-4">
      <div ref={logoRef} className="mb-8">
        <Link to="/">
          <h1 className="text-flyerflix-red text-4xl font-bold transition-all duration-300 hover:scale-105">FLYERFLIX</h1>
        </Link>
      </div>
      
      <div ref={formRef} className="w-full max-w-md bg-[#1e1e1e] p-8 rounded-lg shadow-lg border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Criar conta</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1 animate-fade-in" style={{
          animationDelay: '100ms'
        }}>
            <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
              Nome completo
            </label>
            <Input id="name" name="name" type="text" placeholder="Seu nome" className="bg-[#333] border-[#444] text-white min-h-[44px] animated-input" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="space-y-1 animate-fade-in" style={{
          animationDelay: '200ms'
        }}>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
              E-mail
            </label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" className="bg-[#333] border-[#444] text-white min-h-[44px] animated-input" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative animate-fade-in" style={{
          animationDelay: '300ms'
        }}>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1">
                Senha
              </label>
              <div className="relative">
                <Input id="password" name="password" type={showPasswords ? "text" : "password"} placeholder="••••••••" className="bg-[#333] border-[#444] text-white pr-10 min-h-[44px] animated-input" value={formData.password} onChange={handleChange} required minLength={6} />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1">
                Confirmar senha
              </label>
              <div className="relative">
                <Input id="confirmPassword" name="confirmPassword" type={showPasswords ? "text" : "password"} placeholder="••••••••" className="bg-[#333] border-[#444] text-white pr-10 min-h-[44px] animated-input" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
              </div>
            </div>
            
            {/* Single eye icon for both password fields */}
            <button type="button" className="absolute right-3 top-8 transform text-white/70 hover:text-white transition-all duration-200 md:right-[calc(50%+10px)]" onClick={() => setShowPasswords(!showPasswords)} aria-label={showPasswords ? "Esconder senhas" : "Mostrar senhas"}>
              {showPasswords ? <EyeOff size={18} className="py-[2px] px-0 mx-[11px] my-[4px]" /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="space-y-3 pt-2 animate-fade-in" style={{
          animationDelay: '400ms'
        }}>
            <h3 className="text-lg font-medium text-white">Escolha seu plano</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${formData.planChoice === 'free' ? 'border-flyerflix-red bg-[#2a1b1b]' : 'border-white/20 bg-[#222] hover:bg-[#272727]'}`} onClick={() => handlePlanChoice('free')}>
                <div className="font-bold text-white mb-1">Plano Grátis</div>
                <div className="text-sm text-white/70">2 downloads por dia</div>
                <div className="text-lg font-medium text-white mt-2">R$0</div>
              </div>
              
              <div className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${formData.planChoice === 'ultimate' ? 'border-flyerflix-red bg-[#2a1b1b]' : 'border-white/20 bg-[#222] hover:bg-[#272727]'}`} onClick={() => handlePlanChoice('ultimate')}>
                <div className="font-bold text-white mb-1">Plano Ultimate</div>
                <div className="text-sm text-white/70">Downloads ilimitados</div>
                <div className="text-lg font-medium text-white mt-2">R$23,90<span className="text-xs text-white/60">/mês</span></div>
                {formData.planChoice === 'ultimate' && <div className="text-xs text-flyerflix-red mt-1">
                    Pagamento será processado após criar a conta
                  </div>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2 animate-fade-in" style={{
          animationDelay: '500ms'
        }}>
            <Checkbox id="acceptTerms" name="acceptTerms" checked={formData.acceptTerms} onCheckedChange={checked => setFormData(prev => ({
            ...prev,
            acceptTerms: checked === true
          }))} className="data-[state=checked]:bg-flyerflix-red transition-all duration-200" />
            <label htmlFor="acceptTerms" className="text-sm font-medium text-white/70 cursor-pointer">
              Concordo com os <Link to="/termos-de-uso" className="text-flyerflix-red hover:underline transition-all duration-200">termos de uso</Link> e <Link to="/politica-de-privacidade" className="text-flyerflix-red hover:underline transition-all duration-200">política de privacidade</Link>
            </label>
          </div>
          
          <Button type="submit" className="w-full bg-flyerflix-red hover:bg-red-700 mt-6 min-h-[44px] transition-all duration-300 hover:shadow-lg active:scale-98 animate-fade-in" style={{
          animationDelay: '600ms'
        }} disabled={isLoading}>
            {isLoading ? <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {formData.planChoice === 'ultimate' ? 'Criando conta e preparando pagamento...' : 'Criando conta...'}
              </span> : formData.planChoice === 'ultimate' ? 'Criar conta e pagar' : 'Criar conta'}
          </Button>
        </form>
        
        <div className="mt-6 text-center animate-fade-in" style={{
        animationDelay: '700ms'
      }}>
          <p className="text-white/70">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-flyerflix-red hover:underline transition-all duration-200">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>;
};
export default Register;