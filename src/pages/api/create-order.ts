import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

type Data =
  | { id: string; entity: string; amount: number; currency: string; receipt: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      });

      const options = {
        amount: amount, // amount in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Order creation failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
