import type { Contact, Wechaty } from 'wechaty';
import { log } from 'wechaty';
import authing from '../lib/authing';

export default async function ready(this: Wechaty): Promise<void> {
  // 主动拉取 Authing 用户列表
  // TODO: Pagination
  const { list: users } = await authing.users.list(1, 200);

  const allFriends = await this.Contact.findAll();

  // 筛选出用户中的好友
  const friends = allFriends.filter(
    (contact) => ~users.findIndex((user) => user.externalId === contact.id)
  );

  // 判断群聊是否存在
  const { name } = await authing.userpool.detail();
  const name = '创建群测试2';
  const room = await this.Room.find({
    topic: name
  });

  let memberList: Contact[];
  if (room!) {
    // 删除成员和提醒不确定状态
    memberList = await room.memberAll();
    log.info(name, `Current group members: ${memberList.length}`);
    const { list: deletedUsers } = await authing.users.listArchivedUsers(
      1,
      200
    );
    const members2Delete = memberList.filter(
      (member) =>
        ~deletedUsers.findIndex((user) => user.externalId === member.id)
    );
    log.info(name, `members2Delete: ${members2Delete.length}`);
    const members2Warning = memberList.filter(
      (member) =>
        !~deletedUsers.findIndex((user) => user.externalId === member.id) &&
        !~users.findIndex((user) => user.externalId === member.id)
    );
    log.info(name, `members2Warning: ${members2Warning.length}`);

    await room.say(
      `准备删除成员（注意删除失败的需要放到警告列表中）：\n ${members2Delete
        .map((c) => `${c.name()}(${c.id})`)
        .join('\n')}`
    );

    await room.say(
      `警告需要手动确认状态：\n ${members2Warning
        .map((c) => `${c.name()}(${c.id})`)
        .join('\n')}`
    );

    // 检查未入群的好友
    const members2Invite = friends.filter(
      (friend) => !~memberList.findIndex((member) => member.id === friend.id)
    );
    // 邀请入群
    await room!.say(
      `邀请已经添加机器人好友的用户：\n ${members2Invite
        .map((c) => `${c.name()}(${c.id})`)
        .join('\n')}`
    );
  } else {
    // 检查未入群的好友
    const members2Invite = friends.filter(
      (friend) => ~users.findIndex((user) => user.externalId === friend.id)
    );
    log.info(name, `members2Invite: ${members2Invite.length}`);
    log.info(
      name,
      `Inviting ${members2Invite.map((x) => x.name()).join(',')} `
    );
    // 创建群聊
    const newRoom = await this.Room.create(members2Invite, name);
    await newRoom.ready();
    await newRoom.say('自动创建群聊');
  }
}
