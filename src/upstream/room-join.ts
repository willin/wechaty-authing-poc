import { log } from 'wechaty';
import type { Wechaty, Room, Contact } from 'wechaty';
import { authing } from '../lib/wechaty-authing';

export default async function roomJoin(
  this: Wechaty,
  room: Room,
  inviteeList: Contact[],
  inviter: Contact
): Promise<void> {
  // 只处理本群消息
  if (room.id !== (process.env.WECHATY_ROOM_ID || '19115444039@chatroom'))
    return;
  log.info('Room Join', room);
  log.verbose('inviteeList', inviteeList);
  log.verbose('inviter', inviter);
  // 未注册用户通知
  const { unregistered } = await authing.filterAuthingUsers(inviteeList);
  log.info('Notify unregistered', unregistered);
  await room.say('请 @我 发送你的手机号码', ...unregistered);
  // 批量注册用户
  await authing.createAuthingUsers(unregistered);
}
