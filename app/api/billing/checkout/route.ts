// app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import connectMongo from '../../../../util/mongo';
import Order from '../../../schemas/Order';

interface PaymentRequestBody {
  customerEmail: string;
  productId: string;
  amount: number;
}

export async function POST(req: NextRequest) {
  const { customerEmail, productId, amount }: PaymentRequestBody = await req.json();

  await connectMongo();

  const newOrder = new Order({
    customerEmail,
    productId,
    amount,
    status: 'pending',
  });
  await newOrder.save();

  try {
    const response = await axios.post('https://api.lemonsqueezy.com/v1/checkouts', {
      checkout: {
        email: customerEmail,
        products: [productId],
        custom_price_cents: amount * 100,
      }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({ checkoutUrl: response.data.data.attributes.url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}