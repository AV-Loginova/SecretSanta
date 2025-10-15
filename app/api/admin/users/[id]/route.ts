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
      wishlist: {
        select: {
          id: true,
          title: true,
          description: true,
          link: true,
          price: true,
          createdAt: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
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

  const body = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: body,
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}
