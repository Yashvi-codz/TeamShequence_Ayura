import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const db = await getDatabase();
    const body = await req.json();

    const log = {
      ...body,
      createdAt: new Date(),
    };

    await db.collection('logs').insertOne(log);

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const db = await getDatabase();
    const logs = await db.collection('logs')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ logs });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
