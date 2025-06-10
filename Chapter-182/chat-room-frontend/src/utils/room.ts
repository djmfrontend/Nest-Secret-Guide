function generatePrivateRoomId(userId1: number, userId2: number): string {
  const [a, b] = [userId1, userId2].sort((x, y) => x - y);
  return `private_${a}_${b}`;
}

export { generatePrivateRoomId };
