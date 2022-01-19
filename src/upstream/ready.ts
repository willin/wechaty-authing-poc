import type { Wechaty } from 'wechaty';

// just for test
export default async function ready(this: Wechaty): Promise<void> {
  const room = this.Room.load('19115444039@chatroom');
  const memberList = await room.memberAll();
  const text = memberList.map(
    (contact) => `昵称：${contact.name()}, id： ${contact.id}`
  );
  await room.say(text.join('\n'));
}
