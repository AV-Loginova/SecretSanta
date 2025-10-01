import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';

interface Params {
  userId: string;
}

export async function GET(req: NextRequest, context: { params: Params }) {
  const { params } = context; // await не нужен, но context обязателен
  const userId = Number(params.userId);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(items || []);
}
