import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function adminCheck(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const isApiRequest = req.nextUrl.pathname.startsWith('/api/');

  if (!token) {
    if (isApiRequest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    console.log('Decoded JWT payload:', payload);

    if (payload.role !== 'admin' && payload.role !== 'super') {
      if (isApiRequest) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/', req.url));
    }

    return null;
  } catch {
    if (isApiRequest) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
