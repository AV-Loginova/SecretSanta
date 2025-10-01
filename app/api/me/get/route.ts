import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { prisma } from '../../../../lib/prisma/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const GET = async (req: Request) => {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
};
