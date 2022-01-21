import { log } from 'wechaty';
import type { Message, Wechaty } from 'wechaty';
import { MessageType } from 'wechaty-puppet';
import { authing } from '../lib/wechaty-authing';

export default async function messageHandler(
  this: Wechaty,
  message: Message
): Promise<void> {
  if (
    // 只处理本群消息
    message.room()?.id !==
      (process.env.WECHATY_ROOM_ID || '19115444039@chatroom') ||
    // 只处理文本消息
    message.type() !== MessageType.Text ||
    // 只处理 @ 提及消息
    !(await message.mentionSelf())
  )
    return;
  log.verbose('Message', message);
  const contact = message.talker()!;
  const phone = message.text().match(/\d{11}/)?.[0];
  if (!phone) return;
  const result = await authing.bindAuthingPhone(contact, phone);
  if (result) {
    await message.say(`已成功将 ${contact.name()} 的手机号绑定为： ${phone}`);
  }
}
