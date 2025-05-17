
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@13.3.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing stripe signature', { status: 400 });
  }
  
  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }
    
    // Handle the event based on its type
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.user_id;
        
        if (userId) {
          // Update the user's profile to the Ultimate plan
          const { error } = await supabase
            .from('profiles')
            .update({
              plan: 'ultimate',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (error) {
            console.error('Error updating user plan:', error);
            return new Response(`Error updating user plan: ${error.message}`, { status: 500 });
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;
        
        if (userId) {
          // Downgrade user to free plan when subscription is canceled
          const { error } = await supabase
            .from('profiles')
            .update({
              plan: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (error) {
            console.error('Error downgrading user plan:', error);
            return new Response(`Error downgrading user plan: ${error.message}`, { status: 500 });
          }
        }
        break;
      }
      
      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }
});
