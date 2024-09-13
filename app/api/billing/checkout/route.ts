import { NextRequest, NextResponse } from 'next/server';
import { lemonSqueezySetup, createCheckout, type NewCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import connectMongo from '../../../../util/mongo';
import Order from '../../../schemas/Order';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

// Setup Lemon Squeezy API
lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
  onError(error) {
    console.error('Lemon Squeezy SDK error:', error);
  },
});

const uuid = uuidv4();

interface PaymentRequestBody {
  customerEmail: string;
  productId: string;
  amount: number;
  storeId: number;
  variantId: number;
}

export async function POST(req: NextRequest) {
  const { customerEmail, productId, amount, storeId, variantId }: PaymentRequestBody = await req.json();

  await connectMongo();
  const hash = CryptoJS.HmacSHA256(uuid, process.env.SECRET).toString();
  const newOrder = new Order({
    customerEmail,
    productId,
    orderId: hash,
    amount: amount ?? 1,
    status: 'pending',
  });
  await newOrder.save();

  const newCheckout: NewCheckout = {
    productOptions: {
      name: 'Greesy Premium',
      description: 'Access Premium',
    },
    checkoutOptions: {
      embed: true,
      media: true,
      logo: true,
    },
    checkoutData: {
      email: customerEmail,
      name: 'Customer Name',
    },
    expiresAt: null,
    preview: true,
    testMode: true,
  };

  try {
    const { statusCode, error, data } = await createCheckout("121376", "512496", newCheckout);

    if (error) {
      console.error('Create Checkout error:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({ checkoutUrl: data?.data.attributes.url }, { status: statusCode });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 });
  }
}
