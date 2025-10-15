import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@lib/prisma/prisma';
import { adminCheck } from '@lib/middleware/adminCheck';
import { assignSecretSanta } from '@lib/secretSanta/secretSanta';

export async function POST(req: NextRequest) {
  const res = adminCheck(req);

  if (res) {
    return res;
  }

  const users = await prisma.user.findMany();
  const assignments = await assignSecretSanta(users);

  return NextResponse.json({ success: true, assignments });
}
