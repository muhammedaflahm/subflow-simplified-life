
import "https://deno.land/std@0.168.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    
    console.log('Webhook received:', { signature: !!signature, bodyLength: body.length });

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    let event;

    if (webhookSecret && signature) {
      // Verify webhook signature
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        throw new Error("Invalid signature");
      }
    } else {
      // If no webhook secret, parse the body directly (for testing)
      event = JSON.parse(body);
    }

    console.log('Webhook event type:', event.type);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Handle different webhook events
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Processing checkout.session.completed:', session.id);

        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const customerId = session.customer;
          const customer = await stripe.customers.retrieve(customerId);

          // Update payment record
          await supabase.from("payments").upsert({
            user_id: session.metadata?.user_id,
            stripe_session_id: session.id,
            amount: subscription.items.data[0].price.unit_amount || 0,
            currency: subscription.currency.toUpperCase(),
            status: "completed",
            subscription_type: session.metadata?.subscription_type || "monthly",
          });

          // Upgrade user subscription if user_id is provided
          if (session.metadata?.user_id) {
            await supabase.rpc("upgrade_user_subscription", {
              user_uuid: session.metadata.user_id,
              new_tier: "premium",
            });
          }
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log('Processing customer.subscription.deleted:', deletedSubscription.id);

        // Find user by customer ID and downgrade
        const customer = await stripe.customers.retrieve(deletedSubscription.customer);
        if (customer.email) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', customer.email)
            .single();

          if (profile) {
            await supabase.rpc("upgrade_user_subscription", {
              user_uuid: profile.id,
              new_tier: "free",
            });
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
