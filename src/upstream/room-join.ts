import { log } from 'wechaty';
import type { Wechaty, Room, Contact } from 'wechaty';
import authing from '../lib/authing';
import { asyncFilter, getGenderFromContact } from '../lib/utils';

export default async function roomJoin(
  this: Wechaty,
  room: Room,
  inviteeList: Contact[],
  inviter: Contact
): Promise<void> {
  log.info(this.name(), 'Room Join');
  log.info(this.name(), room);
  log.info(this.name(), inviteeList);
  log.info(this.name(), inviter);
  // 未注册用户通知
  const unRegisteredUsers = await asyncFilter(
    inviteeList,
    async (contact: Contact) =>
      // eslint-disable-next-line no-return-await
      await authing.users.exists({
        externalId: contact.id
      })
  );
  // 批量注册用户
  await Promise.allSettled(
    inviteeList.map((contact: Contact) =>
      authing.users.create({
        registerSource: ['wechaty'],
        externalId: contact.id,
        username: contact.id,
        nickname: contact.name(),
        gender: getGenderFromContact(contact.gender())
      })
    )
  );

  await room.say('请 @我 发送你的手机号码', ...unRegisteredUsers);
}
