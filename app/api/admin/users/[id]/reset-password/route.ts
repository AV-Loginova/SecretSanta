import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';
import { adminCheck } from '@lib/middleware/adminCheck';
import bcrypt from 'bcrypt';

const PASSWORD_LENGTH = 12;

function generatePassword(length = PASSWORD_LENGTH) {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const res = adminCheck(req);

  if (res) {
    return res;
  }

  const { id } = context.params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const newPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  try {
    return NextResponse.json(
      { message: 'Пароль успешно сброшен', result: 'ok' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Ошибка при отправке email:', err);

    return NextResponse.json(
      { error: 'Не удалось отправить письмо пользователю' },
      { status: 500 }
    );
  }
}
