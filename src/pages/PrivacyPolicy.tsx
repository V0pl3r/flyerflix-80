
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-flyerflix-black text-white">
      <Navbar />
      
      <div className="flyerflix-container pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Introdução</h2>
              <p>
                A Flyerflix está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nossos serviços, em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. Coleta de Informações</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, como dados de cadastro (nome, e-mail, senha), informações de pagamento, e conteúdo que você compartilha em nossa plataforma. Também coletamos automaticamente certos dados, como endereço IP, tipo de navegador, páginas visitadas e tempo gasto na plataforma.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Uso das Informações</h2>
              <p>
                Utilizamos suas informações para fornecer e melhorar nossos serviços, processar transações, enviar comunicações sobre sua conta e atualizações, responder a suas dúvidas, e para fins de marketing (com seu consentimento). Também usamos dados agregados para análise e melhoria da plataforma.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Compartilhamento de Informações</h2>
              <p>
                Podemos compartilhar suas informações com:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Prestadores de serviços que nos auxiliam na operação da plataforma;</li>
                <li>Parceiros comerciais para oferecer produtos ou serviços que possam interessar a você;</li>
                <li>Autoridades governamentais quando exigido por lei;</li>
                <li>Em caso de reorganização empresarial, fusão ou venda.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Segurança de Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum sistema é completamente seguro, e não podemos garantir a segurança absoluta de suas informações.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">6. Seus Direitos</h2>
              <p>
                De acordo com a LGPD, você tem direito a:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acessar seus dados pessoais;</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Solicitar a portabilidade de seus dados;</li>
                <li>Revogar seu consentimento a qualquer momento;</li>
                <li>Solicitar a exclusão de seus dados pessoais.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">7. Cookies e Tecnologias Similares</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, lembrar suas preferências e entender como você usa nossa plataforma. Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">8. Alterações nesta Política</h2>
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre alterações significativas através de aviso destacado em nossa plataforma ou por e-mail.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">9. Contato</h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato com nosso Encarregado de Proteção de Dados através do e-mail: privacidade@flyerflix.com
              </p>
            </section>
          </div>
          
          <div className="mt-10 text-center">
            <Link to="/" className="text-flyerflix-red hover:underline">
              Voltar para página inicial
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
