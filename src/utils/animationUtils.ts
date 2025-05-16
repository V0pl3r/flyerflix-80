
/**
 * Sets up scroll reveal animations that make elements fade in when they enter the viewport
 * @returns A cleanup function to disconnect the observer when component unmounts
 */
export const setupScrollRevealAnimations = () => {
  // Create intersection observer to detect when elements scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Add the 'revealed' class when element is visible
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing after element is revealed
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.15, // Element is considered visible when 15% is visible
    rootMargin: '0px 0px -100px 0px' // Adds a bottom margin to trigger slightly earlier
  });
  
  // Find all elements with the reveal-on-scroll class and observe them
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
  
  return {
    cleanup: () => observer.disconnect(),
    reveal: (element: HTMLElement) => {
      element.classList.add('reveal-on-scroll');
      observer.observe(element);
    },
    revealAll: (elements: NodeListOf<HTMLElement> | HTMLElement[]) => {
      elements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
      });
    }
  };
};

/**
 * Applies staggered animations to child elements of a container
 * @param containerSelector CSS selector for the parent container
 * @param childSelector CSS selector for the children to animate
 * @param delay Base delay in milliseconds between each child animation
 */
export const applyStaggeredAnimations = (
  containerSelector: string, 
  childSelector: string, 
  delay = 100
) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const children = container.querySelectorAll(childSelector);
  
  children.forEach((child, index) => {
    // Add initial state
    child.classList.add('opacity-0', 'translate-y-4');
    
    // Apply animation with staggered delay
    setTimeout(() => {
      child.classList.remove('opacity-0', 'translate-y-4');
      child.classList.add('transition-all', 'duration-500', 'ease-out', 'opacity-100', 'translate-y-0');
    }, delay * index);
  });
};

/**
 * Creates a smooth page transition effect
 * @param pageOutCallback Function to call after the page exit animation completes
 */
export const pageTransition = (pageOutCallback: () => void) => {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add(
    'fixed', 'inset-0', 'z-50', 'bg-flyerflix-black', 
    'opacity-0', 'pointer-events-none', 'transition-opacity', 'duration-300'
  );
  document.body.appendChild(overlay);
  
  // Fade in overlay
  setTimeout(() => {
    overlay.classList.add('opacity-100');
    overlay.classList.remove('pointer-events-none');
    
    // Call callback after overlay is visible
    setTimeout(() => {
      pageOutCallback();
      
      // Remove overlay after navigation
      setTimeout(() => {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        
        // Remove from DOM after fade out
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 300);
      }, 100);
    }, 300);
  }, 10);
};

/**
 * Creates a bouncing animation on an element when called
 * @param element Element to apply the bounce animation to
 */
export const applyBounceAnimation = (element: HTMLElement) => {
  // Remove any existing animation
  element.style.animation = 'none';
  
  // Trigger reflow
  void element.offsetWidth;
  
  // Apply animation
  element.style.animation = 'bounce 0.5s ease';
};

// Add the bounce keyframes to the document if not already present
export const addBounceKeyframes = () => {
  const styleId = 'animation-keyframes';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }
};
