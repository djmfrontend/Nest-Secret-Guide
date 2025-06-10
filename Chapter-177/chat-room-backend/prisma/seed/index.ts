// // 用来手动填充数据
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // 获取所有没有roomId的私聊记录（注意：我们目前只有私聊）
//   const messages = await prisma.chatHistory.findMany({
//     where: {
//       roomId: null,
//     },
//   });

//   // 为每条记录生成roomId
//   for (const message of messages) {
//     const roomId = generatePrivateRoomId(message.senderId, message.recipientId);
//     await prisma.chatHistory.update({
//       where: { id: message.id },
//       data: { roomId },
//     });
//   }
// }

// function generatePrivateRoomId(userId1: number, userId2: number): string {
//   const sortedIds = [userId1, userId2].sort((a, b) => a - b);
//   return `private_${sortedIds[0]}_${sortedIds[1]}`;
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
