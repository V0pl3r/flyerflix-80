
import { Check } from 'lucide-react';

const ComparisonSection = () => {
  const advantages = [
    {
      id: 1,
      title: "Preço mais acessível",
      description: "Por apenas R$23,90/mês no plano Ultimate, enquanto outras plataformas cobram muito mais."
    },
    {
      id: 2,
      title: "Foco exclusivo em eventos",
      description: "Templates específicos para festas, shows e eventos, não somos um banco genérico."
    },
    {
      id: 3,
      title: "Interface inspirada em streaming",
      description: "Navegação intuitiva e familiar, sem precisar aprender uma nova interface complexa."
    },
    {
      id: 4,
      title: "Integração direta com Canva",
      description: "Edite facilmente qualquer template no Canva sem complicações ou conversões."
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="flyerflix-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a Flyerflix?</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Conheça as vantagens que fazem da Flyerflix a melhor plataforma de templates para seus eventos
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage) => (
            <div key={advantage.id} className="bg-flyerflix-black border border-white/10 p-6 rounded-lg">
              <div className="bg-flyerflix-red rounded-full w-8 h-8 flex items-center justify-center mb-4">
                <Check className="text-white" size={16} />
              </div>
              <h3 className="text-xl font-bold mb-2">{advantage.title}</h3>
              <p className="text-white/70">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
