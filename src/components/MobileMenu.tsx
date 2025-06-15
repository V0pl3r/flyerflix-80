
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden pt-4 pb-2 space-y-3 border-t border-white/10 mt-4 animate-fade-in">
      <div className="flex flex-col space-y-2 pt-2">
        <Link to="/login" className="w-full">
          <Button className="flyerflix-btn-secondary w-full btn-hover-effect">
            Entrar
          </Button>
        </Link>
        <Link to="/register" className="w-full">
          <Button className="flyerflix-btn-primary w-full btn-hover-effect">
            Registrar-se
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
