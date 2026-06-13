import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_T0HTggTI47vAg6",       // <-- Hardcode your NEW Key ID
  key_secret: "l85QLhT7gxzCSef1HewueCpY",        // <-- Hardcode your NEW Secret
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("1. Received Body from Cart:", body);

    if (!body.amount) {
      console.error("Error: Amount is missing or zero");
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    console.log("2. Attempting Razorpay Order Creation for amount:", body.amount);
    
    const options = {
      amount: body.amount, // Frontend already converted it!
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2, 9)}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("3. Order Created Successfully:", order.id);
    return NextResponse.json({ orderId: order.id }, { status: 200 });

  } catch (error: any) {
    // THIS IS THE SMOKING GUN
    console.error("RAZORPAY FATAL ERROR:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to create order", 
        details: error?.description || error?.message || JSON.stringify(error) 
      }, 
      { status: 500 }
    );
  }
}