
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-flyerflix-black text-white">
      <Navbar />
      
      <div className="flyerflix-container pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Termos de Uso</h1>
          
          <div className="space-y-6 text-white/80">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar os serviços da Flyerflix, você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso. Se você não concordar com parte ou totalidade destes termos, não deverá utilizar nossos serviços.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. Descrição dos Serviços</h2>
              <p>
                A Flyerflix oferece uma plataforma online para acesso a templates digitais para eventos e festas, disponíveis para download conforme o plano contratado pelo usuário. Os serviços incluem, mas não se limitam a, acesso a templates, capacidade de download e uso pessoal dos mesmos.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Conta de Usuário</h2>
              <p>
                Para acessar determinados recursos da plataforma, é necessário criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem sob sua conta. Você concorda em notificar imediatamente a Flyerflix sobre qualquer uso não autorizado de sua conta.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Planos e Pagamentos</h2>
              <p>
                A Flyerflix oferece diferentes planos de assinatura. As condições específicas de cada plano, incluindo preço, duração e recursos disponíveis, estão detalhadas na página de planos. Os pagamentos são processados através de meios seguros e as assinaturas são renovadas automaticamente, salvo cancelamento prévio pelo usuário.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo disponível na plataforma, incluindo mas não se limitando a templates, imagens, textos, logotipos e design, é propriedade da Flyerflix ou de seus fornecedores e é protegido por leis de direitos autorais. O acesso aos templates não transfere a propriedade dos mesmos ao usuário, apenas concede uma licença limitada de uso conforme os termos do plano contratado.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">6. Limitações de Uso</h2>
              <p>
                É expressamente proibido revender, redistribuir ou sublicenciar os templates disponibilizados pela plataforma. O uso dos templates é pessoal e limitado às condições do plano contratado.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">7. Política de Privacidade</h2>
              <p>
                O uso de informações pessoais coletadas através da plataforma é regido pela nossa Política de Privacidade, que pode ser acessada <Link to="/politica-de-privacidade" className="text-flyerflix-red hover:underline">aqui</Link>.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">8. Alterações nos Termos</h2>
              <p>
                A Flyerflix reserva-se o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação na plataforma. É responsabilidade do usuário verificar regularmente estes termos para estar ciente de quaisquer modificações.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">9. Lei Aplicável</h2>
              <p>
                Estes termos são regidos e interpretados de acordo com as leis do Brasil. Quaisquer disputas relacionadas a estes termos ou ao uso da plataforma serão submetidas à jurisdição dos tribunais brasileiros.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">10. Contato</h2>
              <p>
                Para quaisquer questões relacionadas a estes termos, entre em contato conosco através do e-mail: suporte@flyerflix.com
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

export default TermsOfUse;
