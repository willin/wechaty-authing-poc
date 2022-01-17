import type { Contact, Wechaty } from 'wechaty';
import { log } from 'wechaty';
import authing from '../lib/authing';

export default async function ready(this: Wechaty): Promise<void> {
  try {
    const { name } = await authing.userpool.detail();
    const room = await this.Room.find({
      topic: name
    });
    // TODO: Pagination
    const { list: users } = await authing.users.list(1, 200);

    // 添加未注册的用户为好友
    // const unregisteredUsers = users.filter((user) => !user.externalId);
    // await Promise.all(
    //   unregisteredUsers.map(async (user) => {
    //     const contact = await this.Friendship.search({ phone: user.phone });
    //     // FIXME: 慎用
    //     await this.Friendship.add(contact!, '机器人添加测试');
    //   })
    // );

    const registeredUsers = users.filter((user) => !!user.externalId);
    const friends: Contact[] = [];

    log.info(name, 'ready');
    const result = await Promise.allSettled(
      registeredUsers.map(async (user) => {
        const contact = await this.Friendship.search({ phone: user.phone! });
        if (contact?.friend()) {
          friends.push(contact);
        }
        return contact;
      })
    );
    const allContacts = result.filter(
      (x) => x.status === 'fulfilled' && x.value !== null
    ) as unknown as PromiseFulfilledResult<Contact>[];
    log.info(name, 'allContacts', allContacts);
    // 判断群聊是否存在
    if (room) {
      log.info(name, 'room exists');
      // 删除离职成员，添加新成员
      const memberList = await room.memberAll();
      const members2Remove = memberList.filter(
        (member) =>
          ~allContacts.findIndex((contact) => contact.value.id === member.id)
      );
      log.info(name, 'members2Remove', members2Remove);
      await Promise.allSettled(
        members2Remove.map((member) => room.del(member))
      );
      const members2Invite = allContacts.filter(
        (contact) =>
          ~memberList.findIndex((member) => member.id === contact.value.id)
      );
      log.info(name, 'members2Invite', members2Invite);
      await Promise.allSettled(
        members2Invite.map((contact) => room.add(contact.value))
      );
    } else {
      log.info(name, 'room not exists');
      log.info(name, friends);
      // 创建群组
      const newRoom = await this.Room.create(friends, name);
      await newRoom.ready();
      await newRoom.say('Hello World!');
    }
  } catch (e) {
    console.trace(e);
  }
}
