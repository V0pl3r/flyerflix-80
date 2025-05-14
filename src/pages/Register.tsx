import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
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
    toast
  } = useToast();
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
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro ao criar conta",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.acceptTerms) {
      toast({
        title: "Erro ao criar conta",
        description: "Você precisa aceitar os termos de uso e política de privacidade.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
      // Create user in localStorage
      localStorage.setItem('flyerflix-user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        plan: formData.planChoice,
        downloads: 0,
        maxDownloads: formData.planChoice === 'ultimate' ? 'unlimited' : 2
      }));
      toast({
        title: "Conta criada com sucesso!",
        description: formData.planChoice === 'ultimate' ? "Bem-vindo ao plano Ultimate da Flyerflix!" : "Sua conta gratuita foi criada com sucesso!"
      });
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };
  return <div className="min-h-screen bg-flyerflix-black flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8">
        <h1 className="text-flyerflix-red text-4xl font-bold">FLYERFLIX</h1>
      </Link>
      
      <div className="w-full max-w-md bg-[#1e1e1e] p-8 rounded-lg shadow-lg border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Criar conta</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
              Nome completo
            </label>
            <Input id="name" name="name" type="text" placeholder="Seu nome" className="bg-[#333] border-[#444] text-white min-h-[44px]" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
              E-mail
            </label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" className="bg-[#333] border-[#444] text-white min-h-[44px]" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1">
                Senha
              </label>
              <div className="relative">
                <Input id="password" name="password" type={showPasswords ? "text" : "password"} placeholder="••••••••" className="bg-[#333] border-[#444] text-white pr-10 min-h-[44px]" value={formData.password} onChange={handleChange} required minLength={6} />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1">
                Confirmar senha
              </label>
              <div className="relative">
                <Input id="confirmPassword" name="confirmPassword" type={showPasswords ? "text" : "password"} placeholder="••••••••" className="bg-[#333] border-[#444] text-white pr-10 min-h-[44px]" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
              </div>
            </div>
            
            {/* Single eye icon for both password fields */}
            <button type="button" className="absolute right-3 top-8 transform text-white/70 hover:text-white md:right-[calc(50%+10px)]" onClick={() => setShowPasswords(!showPasswords)} aria-label={showPasswords ? "Esconder senhas" : "Mostrar senhas"}>
              {showPasswords ? <EyeOff size={18} className="" /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-medium text-white">Escolha seu plano</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.planChoice === 'free' ? 'border-flyerflix-red bg-[#2a1b1b]' : 'border-white/20 bg-[#222]'}`} onClick={() => handlePlanChoice('free')}>
                <div className="font-bold text-white mb-1">Plano Grátis</div>
                <div className="text-sm text-white/70">2 downloads por dia</div>
                <div className="text-lg font-medium text-white mt-2">R$0</div>
              </div>
              
              <div className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.planChoice === 'ultimate' ? 'border-flyerflix-red bg-[#2a1b1b]' : 'border-white/20 bg-[#222]'}`} onClick={() => handlePlanChoice('ultimate')}>
                <div className="font-bold text-white mb-1">Plano Ultimate</div>
                <div className="text-sm text-white/70">Downloads ilimitados</div>
                <div className="text-lg font-medium text-white mt-2">R$23,90<span className="text-xs text-white/60">/mês</span></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="acceptTerms" name="acceptTerms" checked={formData.acceptTerms} onCheckedChange={checked => setFormData(prev => ({
            ...prev,
            acceptTerms: checked === true
          }))} className="data-[state=checked]:bg-flyerflix-red" />
            <label htmlFor="acceptTerms" className="text-sm font-medium text-white/70 cursor-pointer">
              Concordo com os <Link to="/termos-de-uso" className="text-flyerflix-red hover:underline">termos de uso</Link> e <Link to="/politica-de-privacidade" className="text-flyerflix-red hover:underline">política de privacidade</Link>
            </label>
          </div>
          
          <Button type="submit" className="w-full bg-flyerflix-red hover:bg-red-700 mt-6 min-h-[44px]" disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white/70">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-flyerflix-red hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>;
};
export default Register;