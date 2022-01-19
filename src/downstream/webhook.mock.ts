import { log, Wechaty } from 'wechaty';
import authing from '../lib/authing';

export async function listener(this: Wechaty): Promise<void> {
  const { list: deletedUsers } = await authing.users.listArchivedUsers(1, 200);
  log.info('Webhook', `deletedUsers: ${deletedUsers.length}`);

  const { name } = await authing.userpool.detail();
  const room = await this.Room.find({
    topic: name
  });
  const memberList = await room?.memberAll();
  const members2Delete = memberList?.filter(
    (member) => ~deletedUsers.findIndex((user) => user.externalId === member.id)
  );
  log.info(name, `members2Delete: ${members2Delete?.length}`);

  log.info(
    name,
    `准备删除成员（注意删除失败的需要放到警告列表中）：\n ${members2Delete
      ?.map((c) => `${c.name()}(${c.id})`)
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
  const members2Warning = members2Delete?.filter(
    (_, index) => result[index].status === 'rejected'
  );

  // 通知可以私发给管理员
  await room?.say(
    `请检查以下成员的删除情况：\n ${members2Warning
      ?.map((c) => `${c.name()}(${c.id})`)
      .join('\n')}`
  );

  setTimeout(listener.bind(this), 1e4);
}
