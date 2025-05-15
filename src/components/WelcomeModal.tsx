
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WelcomeModalProps {
  userName?: string;
}

const WelcomeModal = ({ userName }: WelcomeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if this is the first visit
    const hasSeenWelcome = localStorage.getItem('flyerflix-welcome-modal-seen');
    
    if (!hasSeenWelcome) {
      // Wait a moment before showing the modal for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('flyerflix-welcome-modal-seen', 'true');
  };
  
  const handleDontShowAgain = () => {
    setIsOpen(false);
    localStorage.setItem('flyerflix-welcome-modal-seen', 'true');
    localStorage.setItem('flyerflix-welcome-modal-never', 'true');
    
    toast({
      title: "Preferência salva",
      description: "Você não verá mais esta mensagem de boas-vindas.",
    });
  };
  
  const greeting = userName ? `Olá, ${userName}!` : 'Bem-vindo à Flyerflix!';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-gradient-to-b from-[#1e1e1e] to-black border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-flyerflix-red">
            {greeting}
          </DialogTitle>
          <DialogDescription className="text-white/90">
            Sua jornada de criação visual começa aqui!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-white">
            Aqui você encontra templates prontos para criar:
          </p>
          
          <ul className="space-y-2 text-white/80">
            <li className="flex items-center">
              <span className="text-flyerflix-red mr-2">•</span>
              Flyers profissionais para suas festas e eventos
            </li>
            <li className="flex items-center">
              <span className="text-flyerflix-red mr-2">•</span>
              Posts atraentes para redes sociais
            </li>
            <li className="flex items-center">
              <span className="text-flyerflix-red mr-2">•</span>
              Convites, cardápios e materiais promocionais
            </li>
          </ul>
          
          <p className="text-white/90">
            Navegue por categorias, favorite seus templates preferidos e crie designs incríveis em minutos!
          </p>
        </div>
        
        <DialogFooter className="flex-col space-y-2 sm:space-y-0">
          <Button 
            onClick={handleClose}
            className="bg-flyerflix-red hover:bg-red-700 w-full sm:w-auto"
          >
            Começar a explorar
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDontShowAgain}
            className="text-white/70 border-white/20 hover:bg-white/10 w-full sm:w-auto"
          >
            Não mostrar novamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
