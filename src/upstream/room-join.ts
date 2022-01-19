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
  // 只处理本群消息
  if (room.id !== '19115444039@chatroom') return;
  log.info(this.name(), 'Room Join');
  log.info(this.name(), room);
  log.info(this.name(), inviteeList);
  log.info(this.name(), inviter);
  // 未注册用户通知
  const unRegisteredUsers = await asyncFilter(inviteeList, (contact: Contact) =>
    authing.users.exists({
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
