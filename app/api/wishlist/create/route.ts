import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';

export async function POST(req: NextRequest) {
  try {
    const { title, imageUrl, link, description, price, userId } =
      await req.json();

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        title,
        imageUrl: imageUrl || '',
        link: link || null,
        description: description ?? null,
        price: price ?? null,
        userId,
      },
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error('Ошибка создания WishlistItem:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
