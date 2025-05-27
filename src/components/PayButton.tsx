import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PayButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50000 }), // ₹500 in paise
      });

      if (!res.ok) throw new Error("Order creation failed");

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "SubFlow Simplified Life",
        description: "Premium Subscription",
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          // TODO: Save payment details in your backend or DB here
        },
        prefill: {
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment failed: " + (error as Error).message);
    }

    setLoading(false);
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? "Processing..." : "Pay ₹500"}
    </button>
  );
}
