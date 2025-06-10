import * as crypto from 'crypto';
export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
export function generatePrivateRoomId(
  userId1: number,
  userId2: number,
): string {
  const [a, b] = [userId1, userId2].sort((x, y) => x - y);
  return `private_${a}_${b}`;
}
