
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const PricingSection = () => {
  const [loadingFree, setLoadingFree] = useState(false);
  const [loadingUltimate, setLoadingUltimate] = useState(false);

  const handleFreeClick = () => {
    setLoadingFree(true);
    // Reset loading after a short delay to simulate a loading state
    setTimeout(() => setLoadingFree(false), 400);
  };

  const handleUltimateClick = () => {
    setLoadingUltimate(true);
    // Reset loading after a short delay to simulate a loading state
    setTimeout(() => setLoadingUltimate(false), 400);
  };

  const plans = [
    {
      id: 'free',
      name: 'Grátis',
      price: 'R$0',
      description: 'Ideal para explorar a plataforma',
      features: [
        { text: '2 downloads por dia', included: true },
        { text: 'Acesso a templates básicos', included: true },
        { text: 'Marca d\'água nos downloads', included: true },
        { text: 'Acesso a todas as categorias', included: false },
        { text: 'Downloads ilimitados', included: false },
        { text: 'Integração com Canva', included: false },
      ],
      buttonText: 'Começar agora',
      handleClick: handleFreeClick,
      loading: loadingFree,
      featured: false
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 'R$23,90',
      period: '/mês',
      description: 'Acesso completo à plataforma',
      features: [
        { text: 'Downloads ilimitados', included: true },
        { text: 'Acesso a todos os templates', included: true },
        { text: 'Sem marca d\'água', included: true },
        { text: 'Acesso antecipado às novidades', included: true },
        { text: 'Templates exclusivos', included: true },
        { text: 'Integração com Canva', included: true },
      ],
      buttonText: 'Assinar agora',
      handleClick: handleUltimateClick,
      loading: loadingUltimate,
      featured: true
    }
  ];

  return (
    <section className="py-20" id="pricing">
      <div className="flyerflix-container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Escolha seu plano</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Selecione a opção que melhor atende às suas necessidades de criação
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-flyerflix-black rounded-xl border ${plan.featured ? 'border-flyerflix-red' : 'border-white/10'} p-8`}
            >
              {plan.featured && (
                <div className="bg-flyerflix-red text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-block mb-4">
                  Mais popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-white/70 ml-1">{plan.period}</span>}
              </div>
              <p className="text-white/70 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check size={18} className="text-flyerflix-red mr-2 flex-shrink-0" />
                    ) : (
                      <X size={18} className="text-white/40 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-white" : "text-white/40"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link to="/register" onClick={plan.handleClick}>
                <Button 
                  className={`${plan.featured ? "flyerflix-btn-primary" : "flyerflix-btn-secondary"} w-full hover:scale-105 transition-all duration-300`}
                  disabled={plan.loading}
                >
                  {plan.loading ? "Carregando..." : plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
