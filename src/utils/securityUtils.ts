
// Security utility to prevent inspection of site code

// Display a warning toast when DevTools detection happens
const showSecurityWarning = () => {
  const warningContainer = document.createElement('div');
  warningContainer.style.position = 'fixed';
  warningContainer.style.top = '20px';
  warningContainer.style.left = '50%';
  warningContainer.style.transform = 'translateX(-50%)';
  warningContainer.style.backgroundColor = '#e11d48';
  warningContainer.style.color = 'white';
  warningContainer.style.padding = '12px 20px';
  warningContainer.style.borderRadius = '4px';
  warningContainer.style.zIndex = '9999';
  warningContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  warningContainer.style.fontWeight = 'bold';
  warningContainer.style.textAlign = 'center';
  warningContainer.innerText = 'Ação bloqueada por questões de segurança';
  
  document.body.appendChild(warningContainer);
  
  // Remove the warning after 3 seconds
  setTimeout(() => {
    if (document.body.contains(warningContainer)) {
      document.body.removeChild(warningContainer);
    }
  }, 3000);
};

// Initialize security measures
export const initSecurity = () => {
  // Block right-click context menu
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showSecurityWarning();
    return false;
  });

  // Block keyboard shortcuts for DevTools
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      showSecurityWarning();
      return false;
    }
    
    // Ctrl+Shift+I or Ctrl+Shift+C or Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) {
      e.preventDefault();
      showSecurityWarning();
      return false;
    }
    
    // Ctrl+U
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      showSecurityWarning();
      return false;
    }
  }, false);

  // Additional detection for when devtools is opened
  // This uses a technique that detects changes in dimensions that happen when devtools opens
  let devtoolsOpen = false;
  const threshold = 160; // Threshold for detection
  
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    // If we detect a significant size difference and devtools wasn't previously detected
    if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
      devtoolsOpen = true;
      showSecurityWarning();
    } else if (!(widthThreshold || heightThreshold) && devtoolsOpen) {
      devtoolsOpen = false;
    }
  };
  
  // Check periodically
  setInterval(checkDevTools, 1000);
};
