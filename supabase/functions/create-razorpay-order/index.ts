
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
    const { amount, currency = "USD", subscriptionType } = await req.json();

    console.log('Creating Razorpay order with:', { amount, currency, subscriptionType });

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay credentials missing:", { keyId: !!razorpayKeyId, keySecret: !!razorpayKeySecret });
      throw new Error("Razorpay credentials not configured");
    }

    // Convert amount to smallest currency unit
    let amountInSmallestUnit;
    if (currency === 'INR' || currency === 'JPY') {
      amountInSmallestUnit = Math.round(amount * 100); // paise for INR, sen for JPY
    } else {
      amountInSmallestUnit = Math.round(amount * 100); // cents for USD, EUR, etc.
    }

    // Create Razorpay order
    const orderData = {
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        subscription_type: subscriptionType,
      },
    };

    console.log('Sending order data to Razorpay:', orderData);

    const authHeader = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const responseText = await response.text();
    console.log('Razorpay API response status:', response.status);
    console.log('Razorpay API response:', responseText);

    if (!response.ok) {
      console.error("Razorpay API error:", response.status, responseText);
      throw new Error(`Razorpay API error: ${response.status} - ${responseText}`);
    }

    const order = JSON.parse(responseText);
    console.log('Successfully created Razorpay order:', order.id);

    return new Response(
      JSON.stringify({ order }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error creating order:", error);
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
