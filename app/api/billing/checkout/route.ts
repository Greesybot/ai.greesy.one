import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextApiRequest) {
  try {
    const req = request
    const token = await getToken({req})
    const data = await request.json()
    
    const priceId = data.priceId;
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.PROJECT_URL}/billing`,
        cancel_url: `${process.env.PROJECT_URL}/billing`,
        metadata: {
          userId: token,
          priceId,
        },
      });
    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}
