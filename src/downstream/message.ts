import { log } from 'wechaty';
import type { Message, Wechaty } from 'wechaty';
import { MessageType } from 'wechaty-puppet';
import { authing } from '../lib/wechaty-authing';

export default async function messageHandler(
  this: Wechaty,
  message: Message
): Promise<void> {
  // 只处理文本消息
  if (message.type() !== MessageType.Text) return;
  const phone = message.text().match(/\d{11}/)?.[0];
  if (!phone) return;
  const contact = message.talker()!;
  log.verbose('Message', message);
  const result = await authing.bindPhoneContact(phone, contact);
  if (result) {
    await message.say(`已成功将 ${contact.name()} 的手机号绑定为： ${phone}`);
  }
}
