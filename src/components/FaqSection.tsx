
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "Como funciona a assinatura da Flyerflix?",
      answer: "A Flyerflix funciona com base em assinatura mensal que permite acesso ilimitado a todos os templates. Após assinar, você pode baixar quantos templates quiser, sem limites diários e sem marca d'água."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos de longo prazo. Seu acesso permanecerá ativo até o final do período já pago."
    },
    {
      question: "Como edito os templates depois de baixar?",
      answer: "Todos os nossos templates possuem integração direta com o Canva, permitindo que você os edite facilmente. Basta clicar no botão 'Editar no Canva' e você será redirecionado para a plataforma com o template já aberto."
    },
    {
      question: "Quais os formatos disponíveis para download?",
      answer: "Oferecemos downloads em diversos formatos como JPG, PNG e PDF, além da opção de edição direta no Canva. Para usuários Ultimate, também disponibilizamos formatos editáveis adicionais."
    },
    {
      question: "Os templates possuem direitos autorais?",
      answer: "Todos os templates da Flyerflix possuem licença comercial, o que significa que você pode utilizá-los para eventos comerciais sem problemas. A única restrição é a revenda dos templates em sua forma original."
    }
  ];

  return (
    <section className="py-20 bg-black" id="faq">
      <div className="flyerflix-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas frequentes</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Tire suas principais dúvidas sobre a Flyerflix
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-white/10 rounded-lg overflow-hidden bg-flyerflix-black/50"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-medium hover:text-flyerflix-red hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-white/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
