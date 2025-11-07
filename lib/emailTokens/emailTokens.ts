import crypto from 'crypto';
import { prisma } from '@lib/prisma/prisma';

export function genRawToken(len = 32) {
  return crypto.randomBytes(len).toString('base64url');
}

export function hashToken(token: string) {
  return crypto
    .createHmac('sha256', process.env.EMAIL_TOKEN_SECRET!)
    .update(token)
    .digest('hex');
}

export async function createEmailToken(
  userId: number,
  type: 'confirm' | 'reset',
  ttlSeconds: number
) {
  const raw = genRawToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  await prisma.emailToken.create({
    data: { userId, tokenHash, type, expiresAt },
  });

  return raw;
}

export async function consumeEmailToken(
  rawToken: string,
  type: 'confirm' | 'reset'
) {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.emailToken.findFirst({
    where: { tokenHash, type },
  });

  if (!record) {
    return null;
  }

  if (record.expiresAt < new Date()) {
    await prisma.emailToken.delete({ where: { id: record.id } });

    return null;
  }

  await prisma.emailToken.delete({ where: { id: record.id } });

  return record.userId;
}
