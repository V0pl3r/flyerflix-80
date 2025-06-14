
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for improved debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Create Supabase client using the anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate the user
    const authHeader = req.headers.get("Authorization")!;
    if (!authHeader) {
      logStep("ERROR", { message: "Authorization header is missing" });
      throw new Error("Authorization header is missing");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      logStep("ERROR", { message: "User not authenticated or email not available" });
      throw new Error("User not authenticated or email not available");
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user profile data for the customer name
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('name, first_name, last_name')
      .eq('id', user.id)
      .single();

    // Determine the name to use for the Stripe customer
    let customerName = profileData?.name;
    if (!customerName && (profileData?.first_name || profileData?.last_name)) {
      customerName = `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim();
    }

    // Initialize Stripe with the secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR", { message: "STRIPE_SECRET_KEY is not configured" });
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    logStep("Checking for existing Stripe customer", { email: user.email });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      // Create a new customer if none exists
      logStep("Creating new Stripe customer", { email: user.email, name: customerName || undefined });
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: customerName || undefined,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = newCustomer.id;
      logStep("Created new Stripe customer", { customerId });
      
      // Save the Stripe customer ID to the user's profile
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
      
      if (updateError) {
        logStep("WARNING", { message: "Failed to save Stripe customer ID to profile", error: updateError.message });
      } else {
        logStep("Saved Stripe customer ID to profile", { userId: user.id });
      }
    }

    // Create a subscription checkout session with a simple price
    logStep("Creating checkout session for subscription", { customerId });
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Flyerflix Ultimate",
              description: "Acesso completo à plataforma Flyerflix"
            },
            unit_amount: 2390, // R$23,90 in centavos
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?upgrade=success`,
      cancel_url: `${req.headers.get("origin")}/configuracoes?upgrade=canceled`,
      locale: "pt-BR",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_update: {
        address: 'auto',
      },
    });

    logStep("Created checkout session", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in create-checkout function:", error);
    
    // Log more specific details for Stripe errors
    if (error.type && error.type.startsWith("Stripe")) {
      logStep("Stripe API Error", { 
        type: error.type,
        code: error.code,
        message: error.message,
        param: error.param
      });
    }
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
