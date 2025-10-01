import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../../lib/prisma/prisma';

interface LoginRequest {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: Request) {
  try {
    const body: LoginRequest = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Чего-то не хватает...' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid email or password',
          message: 'Неверный email или пароль :(',
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Invalid email or password',
          message: 'Неверный email или пароль :(',
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });

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
