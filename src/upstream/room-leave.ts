import { log } from 'wechaty';
import type { Wechaty, Room, Contact } from 'wechaty';
import authing from '../lib/authing';

export default async function roomLeave(
  this: Wechaty,
  room: Room,
  leaverList: Contact[]
): Promise<void> {
  log.info(this.name(), 'Room Leave');
  log.info(this.name(), room);
  log.info(this.name(), leaverList);
  // 批量删除用户
  const result = await Promise.allSettled(
    leaverList.map((contact: Contact) =>
      authing.users
        .find({ externalId: contact.id })
        .then((user) => authing.users.delete(user.id))
    )
  );
  const sender = await this.Room.load(room.id);
  const successList = leaverList
    .filter((_, i) => result[i].status === 'fulfilled')
    .map((contact) => contact.name());
  await sender.say(`用户：${successList.join('、')} 已经被删除`);
  const failedList = leaverList
    .filter((_, i) => result[i].status === 'rejected')
    .map((contact) => contact.name());
  if (failedList.length > 0) {
    await sender.say(
      `用户：${failedList.join('、')} 删除失败，请管理员手动删除。`
    );
  }
}
