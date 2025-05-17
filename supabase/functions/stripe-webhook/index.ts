
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// This webhook will be called by Stripe when subscription events occur
serve(async (req) => {
  // Get the signature from the header
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    console.error("No stripe signature found");
    return new Response(JSON.stringify({ error: "No stripe signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  // Get the webhook secret from environment variables
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("Stripe webhook secret not set");
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
    
    console.log(`Webhook event received: ${event.type}`);
    
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
          console.error(`User not found for email: ${email}`);
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
              plan: "ultimate" 
            })
            .eq("id", userData.id);
          
          if (error) {
            throw new Error(`Failed to update user plan: ${error.message}`);
          }
          
          console.log(`Updated plan to Ultimate for user email: ${email}`);
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
          console.error(`User not found for email: ${email}`);
          throw new Error(`User not found for email: ${email}`);
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free"
          })
          .eq("id", userData.id);
        
        if (error) {
          throw new Error(`Failed to update user plan: ${error.message}`);
        }
        
        console.log(`Subscription cancelled for user email: ${email}`);
        break;
      }
      
      // Adicionar handlers para os novos eventos
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment intent succeeded: ${paymentIntent.id} for amount ${paymentIntent.amount}`);
        // Aqui você pode adicionar lógica adicional se necessário
        break;
      }
      
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment intent failed: ${paymentIntent.id}, reason: ${paymentIntent.last_payment_error?.message || 'unknown'}`);
        // Aqui você pode adicionar lógica para notificar o usuário sobre o pagamento com falha
        break;
      }
    }
    
    // Return a success response
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Webhook error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
