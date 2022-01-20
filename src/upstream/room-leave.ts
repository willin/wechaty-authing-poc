import { log } from 'wechaty';
import type { Wechaty, Room, Contact } from 'wechaty';
import { authing } from '../lib/wechaty-authing';

export default async function roomLeave(
  this: Wechaty,
  room: Room,
  leaverList: Contact[]
): Promise<void> {
  // 只处理本群消息
  if (room.id !== (process.env.WECHATY_ROOM_ID || '19115444039@chatroom'))
    return;
  log.info('Room Leave', room);
  log.verbose('leaverList', leaverList);
  // 批量删除用户
  const { success, fail } = await authing.deleteAuthingUsers(leaverList);
  log.info('Batch Delete', '%s | %s', success, fail);

  const sender = await this.Room.find({ id: room.id });

  if (success.length > 0) {
    await sender?.say(`用户：${success.join('、')} 已经被删除`);
  }
  if (fail.length > 0) {
    await sender?.say(`用户：${fail.join('、')} 删除失败。`);
  }
}
