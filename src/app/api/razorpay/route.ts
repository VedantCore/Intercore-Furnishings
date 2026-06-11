import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// 1. Hardcode your actual keys here to bypass the .env block
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,       // <-- Paste your Key ID here
  key_secret: process.env.RAZORPAY_KEY_SECRET!,        // <-- Paste your Key Secret here
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Forces a clean integer
      currency: "INR",
      receipt: "rcpt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}