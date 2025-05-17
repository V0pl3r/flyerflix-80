
import { Link } from 'react-router-dom';
import AdminAccess from './AdminAccess';

const Footer = () => {
  return (
    <footer className="bg-flyerflix-black border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="text-flyerflix-red text-2xl font-bold mb-4 inline-block">
              FLYERFLIX
              {/* Hidden admin access trigger */}
              <span className="ml-1 relative">
                <AdminAccess />
              </span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Templates premium para festas, shows, eventos e muito mais. 
              Crie flyers profissionais em minutos.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-3">Navegação</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                    Registrar-se
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                    Entrar
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Sobre</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-use" className="text-gray-400 hover:text-white transition-colors">
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Política de privacidade
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Contato</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contato@flyerflix.com" className="text-gray-400 hover:text-white transition-colors">
                    contato@flyerflix.com
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Flyerflix. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
