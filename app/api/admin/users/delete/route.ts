import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma/prisma';
import { adminCheck } from '@lib/middleware/adminCheck';

export async function POST(req: NextRequest) {
  const res = adminCheck(req);
  if (res) return res;

  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'number')) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    await prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ success: true, deletedIds: ids });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
