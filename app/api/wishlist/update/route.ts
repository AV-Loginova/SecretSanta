import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';

export async function POST(req: NextRequest) {
  const { id, title, imageUrl, link, description, price } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const item = await prisma.wishlistItem.update({
    where: { id },
    data: { title, imageUrl, link, description, price },
  });

  return NextResponse.json(item);
}
