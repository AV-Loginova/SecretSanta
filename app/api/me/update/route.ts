import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// функция для получения текущего пользователя по JWT cookie
async function getCurrentUser(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;

  try {
    const payload = jwt.verify(match[1], JWT_SECRET) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    return user;
  } catch (e) {
    return null;
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string | null;
    const avatar = formData.get('avatar') as File | null;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    if (avatar) {
      // сохраняем файл в public/uploads
      const arrayBuffer = await avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir))
        fs.mkdirSync(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, avatar.name);
      fs.writeFileSync(filePath, buffer);

      dataToUpdate.avatarUrl = `/uploads/${avatar.name}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
