// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '../../../../util/mongo';
import Order from '../../../schemas/Order';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { event } = await req.json();

  if (event.type === 'order.paid') {
    const orderId = event.data.object.id;

    await Order.findOneAndUpdate({ orderId }, { status: 'completed' });

    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 400 });
}