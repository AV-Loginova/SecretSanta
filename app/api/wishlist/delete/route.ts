import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id)
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  await prisma.wishlistItem.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
