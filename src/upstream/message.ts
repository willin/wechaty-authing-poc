import { log } from 'wechaty';
import type { Message, Wechaty } from 'wechaty';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MessageType } from 'wechaty-puppet';
import authing from '../lib/authing';
import { getGenderFromContact } from '../lib/utils';

export default async function messageHandler(
  this: Wechaty,
  message: Message
): Promise<void> {
  if (
    // 只处理本群消息
    !message.room()?.id !== '19115444039@chatroom' ||
    // 只处理文本消息
    message.type() !== MessageType.Text ||
    // 只处理 @ 提及消息
    !(await message.mentionSelf())
  )
    return;
  log.info(this.name(), 'Message');
  log.info(this.name(), message);
  const contact = message.from()!;
  const phone = message.text().match(/\d{11}/)?.[0];
  if (!phone) return;
  if (
    await authing.users.exists({
      externalId: contact.id
    })
  ) {
    const { id } = await authing.users.find({
      externalId: contact.id
    });
    await authing.users.update(id, {
      phone
    });
  } else {
    // 如果未注册
    await authing.users.create({
      registerSource: ['wechaty'],
      externalId: contact.id,
      username: contact.id,
      nickname: contact.name(),
      gender: getGenderFromContact(contact.gender()),
      phone
    });
  }
  await message.say(`已成功将 ${contact.name()} 的手机号绑定为： ${phone}`);
}
