
// Common utility functions for edge functions

// Helper logging function for improved debugging
export const logStep = (functionName: string, step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${functionName}] ${step}${detailsStr}`);
};

// Generate secure headers
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
