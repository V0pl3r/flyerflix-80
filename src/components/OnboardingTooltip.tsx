
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OnboardingTooltipProps {
  step: number;
  totalSteps: number;
  targetId: string;
  content: string;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

const OnboardingTooltip = ({ 
  step, 
  totalSteps, 
  targetId, 
  content, 
  onNext, 
  onSkip,
  onComplete
}: OnboardingTooltipProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [direction, setDirection] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  
  useEffect(() => {
    const positionTooltip = () => {
      const target = document.getElementById(targetId);
      
      if (!target) return;
      
      const rect = target.getBoundingClientRect();
      const tooltipHeight = 150; // approximate
      const tooltipWidth = 250; // approximate
      
      let newDirection: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
      let top = 0;
      let left = 0;
      
      // Check if there's enough room below
      if (rect.bottom + tooltipHeight < window.innerHeight) {
        top = rect.bottom + 10;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        newDirection = 'bottom';
      } 
      // Check if there's room above
      else if (rect.top - tooltipHeight > 0) {
        top = rect.top - tooltipHeight - 10;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        newDirection = 'top';
      }
      // Check if there's room to the right
      else if (rect.right + tooltipWidth < window.innerWidth) {
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + 10;
        newDirection = 'right';
      }
      // Default to left
      else {
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - 10;
        newDirection = 'left';
      }
      
      // Ensure tooltip is always in viewport
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));
      top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));
      
      setPosition({ top, left });
      setDirection(newDirection);
    };
    
    positionTooltip();
    
    // Highlight target element
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add('ring-2', 'ring-flyerflix-red', 'ring-offset-black', 'ring-offset-2', 'z-50');
    }
    
    // Add resize event listener
    window.addEventListener('resize', positionTooltip);
    
    return () => {
      // Remove highlight and event listener on cleanup
      if (target) {
        target.classList.remove('ring-2', 'ring-flyerflix-red', 'ring-offset-black', 'ring-offset-2', 'z-50');
      }
      window.removeEventListener('resize', positionTooltip);
    };
  }, [targetId]);
  
  const isLastStep = step === totalSteps;
  
  const directionArrow = () => {
    switch (direction) {
      case 'top':
        return 'bottom-[-8px] left-1/2 transform -translate-x-1/2 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#1e1e1e]';
      case 'bottom':
        return 'top-[-8px] left-1/2 transform -translate-x-1/2 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#1e1e1e]';
      case 'left':
        return 'right-[-8px] top-1/2 transform -translate-y-1/2 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-[#1e1e1e]';
      case 'right':
        return 'left-[-8px] top-1/2 transform -translate-y-1/2 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#1e1e1e]';
    }
  };

  return (
    <div 
      className="fixed z-[60] animate-fade-in" 
      style={{ top: position.top, left: position.left }}
    >
      <div className="bg-[#1e1e1e] border border-flyerflix-red text-white rounded-lg shadow-lg p-4 w-[250px] relative">
        {/* Arrow */}
        <div className={`absolute w-0 h-0 ${directionArrow()}`}></div>
        
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 text-white/70 hover:text-white"
          onClick={onSkip}
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
        
        {/* Content */}
        <div className="mt-2 mb-4">
          <p className="text-sm text-white/90">{content}</p>
          <p className="text-xs text-white/50 mt-1">Passo {step} de {totalSteps}</p>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
            onClick={onSkip}
          >
            Pular tutorial
          </Button>
          
          {isLastStep ? (
            <Button 
              size="sm" 
              className="bg-flyerflix-red hover:bg-red-700 text-xs"
              onClick={onComplete}
            >
              Concluir
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="bg-flyerflix-red hover:bg-red-700 text-xs"
              onClick={onNext}
            >
              Próximo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTooltip;
