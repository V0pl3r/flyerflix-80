
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UpgradeButton from './UpgradeButton';

const PricingSection = () => {
  const { user } = useAuth();
  
  const freeBenefits = [
    '2 downloads gratuitos por dia',
    'Acesso aos templates básicos',
    'Marca d\'água nos downloads',
  ];
  
  const ultimateBenefits = [
    'Downloads ilimitados',
    'Acesso a todos os templates',
    'Sem marca d\'água',
    'Acesso antecipado a novos templates',
    'Suporte prioritário',
  ];

  return (
    <section id="pricing" className="bg-flyerflix-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Planos Simples, Resultados Incríveis</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Escolha o plano que melhor atende às suas necessidades e transforme seus eventos com templates profissionais.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">Plano Grátis</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">R$0</span>
                <span className="text-gray-400 ml-2 mb-1">/para sempre</span>
              </div>
              <p className="text-gray-400 mb-6">Perfeito para quem está começando e quer experimentar nossas funcionalidades básicas.</p>
              
              <ul className="space-y-3 mb-8">
                {freeBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-green-500 mr-2 shrink-0" size={18} />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              {user ? (
                <button 
                  className="w-full py-3 px-6 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors cursor-not-allowed"
                  disabled
                >
                  Plano Atual
                </button>
              ) : (
                <a href="/register" className="block w-full py-3 px-6 bg-white/10 text-white rounded-full font-medium text-center hover:bg-white/20 transition-colors">
                  Começar Grátis
                </a>
              )}
            </div>
          </div>
          
          {/* Ultimate Plan */}
          <div className="bg-gradient-to-b from-flyerflix-red to-red-800 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 transform translate-x-[30%] translate-y-[50%] rotate-45">
              POPULAR
            </div>
            
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">Plano Ultimate</h3>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-white">R$23,90</span>
                <span className="text-white/70 ml-2 mb-1">/mês</span>
              </div>
              <p className="text-white/80 mb-6">Acesso completo a todos os recursos e templates premium para criadores exigentes.</p>
              
              <ul className="space-y-3 mb-8">
                {ultimateBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-yellow-300 mr-2 shrink-0" size={18} />
                    <span className="text-white">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              {user && user.plan === 'ultimate' ? (
                <button 
                  className="w-full py-3 px-6 bg-black/20 text-white rounded-full font-medium hover:bg-black/30 transition-colors cursor-not-allowed group"
                  disabled
                >
                  <span className="flex items-center justify-center">
                    <Check className="mr-2" size={18} />
                    Assinatura Ativa
                  </span>
                </button>
              ) : (
                <UpgradeButton variant="secondary" size="lg" className="w-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
