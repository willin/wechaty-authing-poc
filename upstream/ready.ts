import { log, Wechaty } from 'wechaty';
import { authing } from '../lib/wechaty-authing';

// just for test
export default async function ready(this: Wechaty): Promise<void> {
  const room = await this.Room.find({
    id: process.env.WECHATY_ROOM_ID || '19115444039@chatroom'
  });
  if (room === null) return;
  const memberList = await room.memberAll();
  // 未注册用户通知
  const { unregistered } = await authing.filterAuthingUsers(memberList);
  log.info('Notify unregistered', unregistered);
  await room.say('请 @我 发送你的手机号码', ...unregistered);
  // 批量注册用户
  await authing.createAuthingUsers(unregistered);
}
