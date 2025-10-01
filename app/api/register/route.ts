import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../../lib/prisma/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterRequest = await req.json();

    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Missimg parameter', message: 'Чего-то не хватает...' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Email exists', message: 'Такой дружок уже есть' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    const response = NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Пупупу... На сервере беда, попробуй позже',
      },
      { status: 500 }
    );
  }
}
