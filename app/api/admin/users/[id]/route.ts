import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';
import { adminCheck } from '@lib/middleware/adminCheck';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = adminCheck(req);
  if (res) {
    return res;
  }

  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
