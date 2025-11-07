import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

import { prisma } from '@lib/prisma/prisma';
import { adminCheck } from '@lib/middleware/adminCheck';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
  theme?: string;
  password?: string;
}

export async function GET(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const res = adminCheck(req);

  if (res) {
    return res;
  }

  const params = await context.params;
  const id = params.id;
  const userId = Number(id);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const res = adminCheck(req);

  if (res) {
    return res;
  }

  const params = await context.params;
  const id = params.id;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const role = formData.get('role') as string | null;
    const password = formData.get('password') as string | null;
    const avatar = formData.get('avatar') as File | null;

    const dataToUpdate: Partial<User> = {};

    if (name) {
      dataToUpdate.name = name;
    }

    if (email) {
      dataToUpdate.email = email;
    }

    if (role) {
      dataToUpdate.role = role;
    }

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    if (avatar && typeof avatar !== 'string') {
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, avatar.name);
      fs.writeFileSync(filePath, buffer);

      dataToUpdate.avatarUrl = `/uploads/${avatar.name}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error('Ошибка обновления пользователя:', err);

    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}
