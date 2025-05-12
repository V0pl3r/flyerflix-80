
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TemplateCarousel from '../components/TemplateCarousel';
import ComparisonSection from '../components/ComparisonSection';
import PricingSection from '../components/PricingSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';
import { featuredTemplates, newTemplates, popularTemplates } from '../data/templates';

const Index = () => {
  useEffect(() => {
    document.title = "Flyerflix - Templates para eventos e festas";
  }, []);

  return (
    <div className="min-h-screen bg-flyerflix-black text-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Template Carousels */}
      <TemplateCarousel title="Novidades da Semana" templates={newTemplates} />
      <TemplateCarousel title="Mais Baixados" templates={popularTemplates} />
      <TemplateCarousel title="Festas" templates={featuredTemplates} />
      
      {/* Comparison Section */}
      <ComparisonSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
