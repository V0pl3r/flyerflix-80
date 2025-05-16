
import { useEffect, useRef } from 'react';
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

// Setup intersection observer for animations
const setupScrollAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all elements with the reveal-on-scroll class
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
  
  return observer;
};

const Index = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Flyerflix - Templates para eventos e festas";
    addPulsingAnimationStyle();
    
    // Add reveal-on-scroll class to elements
    const elementsToAnimate = [carouselRef.current, comparisonRef.current, pricingRef.current, faqRef.current];
    elementsToAnimate.forEach(el => {
      if (el) el.classList.add('reveal-on-scroll');
    });
    
    // Setup scroll animations
    const observer = setupScrollAnimations();
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-flyerflix-black text-white w-full overflow-x-hidden">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Template Carousels - Only showing "Novidades da Semana" */}
      <div className="w-full" ref={carouselRef}>
        <TemplateCarousel title="Novidades da Semana" templates={newTemplates} />
      </div>
      
      {/* Comparison Section */}
      <div ref={comparisonRef}>
        <ComparisonSection />
      </div>
      
      {/* Pricing Section */}
      <div ref={pricingRef}>
        <PricingSection />
      </div>
      
      {/* FAQ Section */}
      <div ref={faqRef}>
        <FaqSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
