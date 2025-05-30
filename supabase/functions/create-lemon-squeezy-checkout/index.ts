
import "https://deno.land/std@0.168.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { variantId, customData } = await req.json();

    console.log('Creating Lemon Squeezy checkout with:', { variantId, customData });

    const lemonSqueezyApiKey = Deno.env.get("LEMON_SQUEEZY_API_KEY");

    if (!lemonSqueezyApiKey) {
      console.error("Lemon Squeezy API key missing");
      throw new Error("Lemon Squeezy API key not configured");
    }

    // Create Lemon Squeezy checkout session
    const checkoutData = {
      data: {
        type: "checkouts",
        attributes: {
          custom_price: null,
          product_options: {
            enabled_variants: [variantId],
          },
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
          },
          checkout_data: customData || {},
          expires_at: null,
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: Deno.env.get("LEMON_SQUEEZY_STORE_ID"),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId.toString(),
            },
          },
        },
      },
    };

    console.log('Sending checkout data to Lemon Squeezy:', JSON.stringify(checkoutData, null, 2));

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lemonSqueezyApiKey}`,
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(checkoutData),
    });

    const responseText = await response.text();
    console.log('Lemon Squeezy API response status:', response.status);
    console.log('Lemon Squeezy API response:', responseText);

    if (!response.ok) {
      console.error("Lemon Squeezy API error:", response.status, responseText);
      throw new Error(`Lemon Squeezy API error: ${response.status} - ${responseText}`);
    }

    const checkout = JSON.parse(responseText);
    console.log('Successfully created Lemon Squeezy checkout:', checkout.data.id);

    return new Response(
      JSON.stringify({ checkout: checkout.data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error creating checkout:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
