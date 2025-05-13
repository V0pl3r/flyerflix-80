
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const platforms = [
    {
      name: "Flyerflix",
      downloads: "Ilimitado (Ultimate) / 2 grátis",
      templates: true,
      canva: true,
      price: "R$ 23,90",
      highlight: true
    },
    {
      name: "Free***",
      downloads: "Limitado",
      templates: false,
      canvaNote: "Só PSDs",
      price: "R$ 55+"
    },
    {
      name: "Desi***",
      downloads: "Limitado",
      templates: false,
      templatesNote: "Genérico",
      canva: false,
      canvaNote: "Só mockups",
      price: "R$ 40+"
    },
    {
      name: "Env***",
      downloads: "Limitado",
      templates: false,
      templatesNote: "Não focado em festas",
      canva: false,
      canvaNote: "Adobe-only",
      price: "R$ 80+"
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
        
        {/* Advantages Cards - For Mobile Only */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:hidden mb-12">
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
        
        {/* Comparison Table - Shows on all screen sizes */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <Table className="min-w-full border-separate border-spacing-0 border border-white/10 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-flyerflix-black/50">
                  <TableHead className="text-left p-4 font-bold text-white">Plataforma</TableHead>
                  <TableHead className="text-left p-4 font-bold text-white">Downloads diários</TableHead>
                  <TableHead className="text-left p-4 font-bold text-white">Templates prontos para festas</TableHead>
                  <TableHead className="text-left p-4 font-bold text-white">Edição no Canva</TableHead>
                  <TableHead className="text-left p-4 font-bold text-white">Preço mensal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platforms.map((platform) => (
                  <TableRow 
                    key={platform.name}
                    className={`${platform.highlight ? "bg-flyerflix-black/80 relative" : "bg-flyerflix-black/30"}`}
                  >
                    <TableCell className="p-4 border-b border-white/5">
                      <div className="flex items-center">
                        <span className={platform.highlight ? "text-flyerflix-red font-bold" : "text-white"}>
                          {platform.name}
                        </span>
                        {platform.highlight && (
                          <span className="ml-2 bg-flyerflix-red text-white text-xs px-2 py-0.5 rounded-full">
                            Mais vantajoso
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-4 border-b border-white/5">{platform.downloads}</TableCell>
                    <TableCell className="p-4 border-b border-white/5">
                      {platform.templates ? (
                        <div className="flex items-center">
                          <Check className="text-green-500 mr-2" size={18} />
                          <span>Sim, especializados</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="text-red-500 mr-2" size={18} />
                          <span>{platform.templatesNote || "Não especializado"}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="p-4 border-b border-white/5">
                      {platform.canva ? (
                        <div className="flex items-center">
                          <Check className="text-green-500 mr-2" size={18} />
                          <span>Sim</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="text-red-500 mr-2" size={18} />
                          <span>{platform.canvaNote || "Não"}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={`p-4 border-b border-white/5 ${platform.highlight ? "font-bold" : ""}`}>
                      {platform.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
