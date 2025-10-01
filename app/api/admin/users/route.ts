import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';
import { adminCheck } from '@lib/middleware/adminCheck';

export async function GET(req: NextRequest) {
  const res = adminCheck(req);

  if (res) {
    return res;
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      avatarUrl: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}
