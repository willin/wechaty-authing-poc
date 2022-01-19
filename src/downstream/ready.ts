import type { Contact, Wechaty } from 'wechaty';
import { log } from 'wechaty';
import authing from '../lib/authing';
import { listener } from './webhook.mock';

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
    log.info(
      name,
      `准备删除成员（注意删除失败的需要放到警告列表中）：\n ${members2Delete
        .map((c) => `${c.name()}(${c.id})`)
        .join('\n')}`
    );
    const result = await Promise.allSettled(
      members2Delete?.map((member) => {
        if (member.friend()) {
          await this.Contact.delete(member);
        }
        return room?.del(member);
      })
    );
    const members2Warning1 = members2Delete?.filter(
      (_, index) => result[index].status === 'rejected'
    );

    const members2Warning2 = memberList.filter(
      (member) =>
        !~deletedUsers.findIndex((user) => user.externalId === member.id) &&
        !~users.findIndex((user) => user.externalId === member.id)
    );
    log.info(
      name,
      `members2Warning: ${members2Warning1.length + members2Warning2.length}`
    );

    // 可以私发管理员通知
    await room.say(
      `警告需要手动确认状态：\n ${members2Warning1
        .map((c) => `${c.name()}(${c.id})`)
        .join('\n')}---\n${members2Warning2
        .map((c) => `${c.name()}(${c.id})`)
        .join('\n')}`
    );

    // 检查未入群的好友
    const members2Invite = friends.filter(
      (friend) => !~memberList.findIndex((member) => member.id === friend.id)
    );
    // 邀请入群
    log.info(
      name,
      `邀请已经添加机器人好友的用户：\n ${members2Invite
        .map((c) => `${c.name()}(${c.id})`)
        .join('\n')}`
    );
    await Promise.allSettled(
      members2Invite?.map((member) => room?.add(member))
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
  // 启动侦听钩子
  listener.bind(this)();
}
