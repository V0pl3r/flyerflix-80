
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TemplateCarousel from '../components/TemplateCarousel';
import ComparisonSection from '../components/ComparisonSection';
import PricingSection from '../components/PricingSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';
import { newTemplates } from '../data/templates';

// Add a CSS keyframes for the pulsing animation
const addPulsingAnimationStyle = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-slow {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    .animate-pulse-slow {
      animation: pulse-slow 3s ease-in-out infinite;
    }
    .animate-pulse-slow:hover {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(style);
};

const Index = () => {
  useEffect(() => {
    document.title = "Flyerflix - Templates para eventos e festas";
    addPulsingAnimationStyle();
  }, []);

  return (
    <div className="min-h-screen bg-flyerflix-black text-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Template Carousels - Only showing "Novidades da Semana" */}
      <TemplateCarousel title="Novidades da Semana" templates={newTemplates} />
      
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
