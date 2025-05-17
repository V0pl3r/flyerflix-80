
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UpgradeButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UpgradeButton = ({
  variant = 'primary',
  size = 'md',
  className = '',
}: UpgradeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createCheckoutSession } = useAuth();

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const checkoutUrl = await createCheckoutSession();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyles = {
    primary: 'bg-flyerflix-red hover:bg-red-700 text-white',
    secondary: 'bg-white text-flyerflix-red hover:bg-gray-100',
    outline: 'bg-transparent border border-flyerflix-red text-flyerflix-red hover:bg-flyerflix-red/10',
  };

  const sizeStyles = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      className={`${buttonStyles[variant]} ${sizeStyles[size]} font-medium rounded-full flex items-center transition-all duration-200 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Upgrade para Ultimate
    </Button>
  );
};

export default UpgradeButton;
