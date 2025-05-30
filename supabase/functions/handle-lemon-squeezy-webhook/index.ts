
import "https://deno.land/std@0.168.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const signature = req.headers.get("X-Signature");
    const body = await req.text();
    
    console.log('Webhook received:', { signature: !!signature, bodyLength: body.length });

    const webhookSecret = Deno.env.get("LEMON_SQUEEZY_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("Webhook secret not configured");
    }

    // Verify webhook signature
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signed = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(body),
    );

    const expectedSignature = Array.from(new Uint8Array(signed))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      throw new Error("Invalid signature");
    }

    const event = JSON.parse(body);
    console.log('Webhook event type:', event.meta.event_name);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Handle different webhook events
    if (event.meta.event_name === "order_created") {
      const order = event.data;
      const customData = order.attributes.first_order_item?.product_options?.checkout_data || {};
      
      console.log('Processing order_created:', order.id, customData);

      // Save payment record
      await supabase.from("payments").insert({
        user_id: customData.user_id,
        lemon_squeezy_order_id: order.id,
        amount: parseInt(order.attributes.total),
        currency: order.attributes.currency,
        status: "completed",
        subscription_type: customData.subscription_type || "monthly",
      });

      // Upgrade user subscription if user_id is provided
      if (customData.user_id) {
        await supabase.rpc("upgrade_user_subscription", {
          user_uuid: customData.user_id,
          new_tier: "premium",
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
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
