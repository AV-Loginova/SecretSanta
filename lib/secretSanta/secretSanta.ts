import { prisma } from '@lib/prisma/prisma';

import { User } from '@prisma/client';

export async function assignSecretSanta(users: User[]) {
  if (users.length < 2) {
    throw new Error('Недостаточно участников');
  }

  await prisma.secretSantaAssignment.deleteMany({});

  const givers = [...users];
  const receivers = [...users];
  const assignments: { giverId: number; receiverId: number }[] = [];

  while (givers.length) {
    const giver = givers.shift()!;
    let receiverIndex = Math.floor(Math.random() * receivers.length);

    if (receivers[receiverIndex].id === giver.id) {
      receiverIndex = (receiverIndex + 1) % receivers.length;
    }

    const receiver = receivers.splice(receiverIndex, 1)[0];
    assignments.push({ giverId: giver.id, receiverId: receiver.id });
  }

  for (const a of assignments) {
    await prisma.secretSantaAssignment.create({ data: a });
  }

  return assignments;
}
