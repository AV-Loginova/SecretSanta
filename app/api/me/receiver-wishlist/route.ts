import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { prisma } from '@lib/prisma/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const GET = async (req: Request) => {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        giftsGiven: {
          include: {
            receiver: { include: { wishlist: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const receiver = user.giftsGiven[0]?.receiver || null;

    return NextResponse.json({
      receiver: receiver
        ? {
            id: receiver.id,
            name: receiver.name,
            email: receiver.email,
            avatarUrl: receiver.avatarUrl,
            wishlist: receiver.wishlist,
          }
        : null,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
};
