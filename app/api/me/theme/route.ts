import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { prisma } from '@lib/prisma/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const PATCH = async (req: Request) => {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  if (!token)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { theme } = await req.json();
  if (!theme)
    return NextResponse.json({ error: 'No theme provided' }, { status: 400 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { theme },
    });

    return NextResponse.json({ theme: user.theme });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
};
