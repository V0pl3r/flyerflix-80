import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Secure logger to prevent logging sensitive data
const logEvent = (type: string, message: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] [${type}] ${message}`, details ? JSON.stringify(details) : '');
};

// This webhook will be called by Stripe when subscription events occur
serve(async (req) => {
  // Get the signature from the header
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    logEvent("ERROR", "No stripe signature found");
    return new Response(JSON.stringify({ error: "No stripe signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  // Get the webhook secret from environment variables
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    logEvent("ERROR", "Stripe webhook secret not set");
    return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Create a Supabase client with service role key for bypassing RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get the request body as text
    const payload = await req.text();
    
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    
    logEvent("INFO", `Webhook event received: ${event.type}`);
    
    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get customer details to find the user
        const customer = await stripe.customers.retrieve(customerId);
        
        if (!customer || customer.deleted) {
          throw new Error(`No customer found with ID: ${customerId}`);
        }
        
        // Get the user's email from the customer object
        const email = customer.email;
        if (!email) {
          throw new Error(`No email found for customer: ${customerId}`);
        }
        
        // Find the user by email
        const { data: userData, error: userError } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("email", email)
          .single();
          
        if (userError || !userData) {
          logEvent("ERROR", `User not found for email: ${email}`);
          throw new Error(`User not found for email: ${email}`);
        }
        
        // Check if the subscription is active
        const isActive = subscription.status === "active" || subscription.status === "trialing";
        
        // Save the subscription details for the user
        if (isActive) {
          // Update the user profile to have Ultimate plan
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({ 
              plan: "ultimate",
              stripe_subscription_id: subscription.id,
              subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq("id", userData.id);
          
          if (error) {
            throw new Error(`Failed to update user plan: ${error.message}`);
          }
          
          logEvent("INFO", `Updated plan to Ultimate for user email: ${email}`);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get customer details to find the user
        const customer = await stripe.customers.retrieve(customerId);
        
        if (!customer || customer.deleted) {
          throw new Error(`No customer found with ID: ${customerId}`);
        }
        
        // Get the user's email from the customer object
        const email = customer.email;
        if (!email) {
          throw new Error(`No email found for customer: ${customerId}`);
        }
        
        // Update the user profile to free plan
        const { data: userData, error: userError } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("email", email)
          .single();
          
        if (userError || !userData) {
          logEvent("ERROR", `User not found for email: ${email}`);
          throw new Error(`User not found for email: ${email}`);
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            stripe_subscription_id: null,
            subscription_period_end: null
          })
          .eq("id", userData.id);
        
        if (error) {
          throw new Error(`Failed to update user plan: ${error.message}`);
        }
        
        logEvent("INFO", `Subscription cancelled for user email: ${email}`);
        break;
      }
      
      // Payment intent events
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logEvent("INFO", `Payment intent succeeded: ${paymentIntent.id} for amount ${paymentIntent.amount}`);

        // If the payment is related to a subscription, we'll log this event
        if (paymentIntent.metadata?.subscription_id) {
          const subscriptionId = paymentIntent.metadata.subscription_id;
          logEvent("INFO", `Payment for subscription: ${subscriptionId}`);
          
          // Additional subscription logging could be added here
        }
        break;
      }
      
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logEvent("WARNING", `Payment intent failed: ${paymentIntent.id}`, {
          reason: paymentIntent.last_payment_error?.message || 'unknown'
        });
        
        // If this was a subscription payment, we could notify the user
        if (paymentIntent.metadata?.subscription_id) {
          const subscriptionId = paymentIntent.metadata.subscription_id;
          logEvent("WARNING", `Failed payment for subscription: ${subscriptionId}`);
          
          // Here you could trigger notifications to inform the user about the failed payment
        }
        break;
      }
      
      case "payment_method.attached": {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        logEvent("INFO", `Payment method attached: ${paymentMethod.id}`);
        break;
      }
      
      // Keep track of customer events
      case "customer.created": 
      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        logEvent("INFO", `Customer event: ${event.type}`, { 
          customerId: customer.id, 
          email: customer.email 
        });
        break;
      }
    }
    
    // Return a success response
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    logEvent("ERROR", `Webhook error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
