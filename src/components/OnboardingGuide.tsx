
import { useState, useEffect } from 'react';
import OnboardingTooltip from './OnboardingTooltip';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  targetId: string;
  content: string;
}

const OnboardingGuide = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const { toast } = useToast();
  
  const steps: OnboardingStep[] = [
    {
      targetId: 'onboarding-discover',
      content: 'Explore novos templates por categoria, estilo ou evento. Deslize para navegar entre os templates disponíveis.'
    },
    {
      targetId: 'onboarding-favorites',
      content: 'Marque seus templates preferidos clicando no ícone de coração para encontrá-los facilmente depois.'
    },
    {
      targetId: 'onboarding-downloads',
      content: 'Acesse seus templates baixados anteriormente para continuar editando seus projetos.'
    },
    {
      targetId: 'onboarding-profile',
      content: 'Gerencie sua conta, configurações e plano de assinatura atual.'
    }
  ];
  
  useEffect(() => {
    // Check if this is the first visit or if onboarding was skipped
    const hasCompletedOnboarding = localStorage.getItem('flyerflix-onboarding-completed');
    const hasSkippedOnboarding = localStorage.getItem('flyerflix-onboarding-skipped');
    
    if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
      // Wait a moment after page load before starting onboarding
      const timer = setTimeout(() => {
        setCurrentStep(0);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleNextStep = () => {
    setCurrentStep(prev => {
      if (prev === null || prev >= steps.length - 1) {
        return null;
      }
      return prev + 1;
    });
  };
  
  const handleSkipTutorial = () => {
    setCurrentStep(null);
    localStorage.setItem('flyerflix-onboarding-skipped', 'true');
    
    toast({
      title: "Tutorial pulado",
      description: "Você pode acessar ajuda a qualquer momento pelo menu.",
      className: "animate-slide-in-right"
    });
  };
  
  const handleCompleteOnboarding = () => {
    setCurrentStep(null);
    localStorage.setItem('flyerflix-onboarding-completed', 'true');
    
    toast({
      title: "Onboarding concluído!",
      description: "Agora você está pronto para aproveitar todos os recursos.",
    });
  };
  
  // Return null if no onboarding step is active
  if (currentStep === null) {
    return null;
  }
  
  // Make sure we have a valid step
  if (currentStep >= steps.length) {
    return null;
  }
  
  const currentStepData = steps[currentStep];
  
  return (
    <OnboardingTooltip
      step={currentStep + 1}
      totalSteps={steps.length}
      targetId={currentStepData.targetId}
      content={currentStepData.content}
      onNext={handleNextStep}
      onSkip={handleSkipTutorial}
      onComplete={handleCompleteOnboarding}
    />
  );
};

export default OnboardingGuide;
