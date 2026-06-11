import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, orderId, amount } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Intercore Studio <onboarding@resend.dev>", // Resend's free testing email
      to: email, // The customer's actual email
      subject: "Your Intercore Furnishings Order Confirmation",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; color: #000000;">
          <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px;">Intercore</h1>
          <p style="font-size: 14px; color: #666;">Thank you for your premium order.</p>
          
          <div style="margin: 40px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 0;"><strong>Total Secured:</strong> ₹${amount.toLocaleString()}</p>
          </div>
          
          <p style="font-size: 12px; color: #999;">Our artisans will begin preparing your shipment immediately.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}