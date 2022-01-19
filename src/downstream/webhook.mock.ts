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
  await room!.say(
    `准备删除成员（注意删除失败的需要放到警告列表中）：\n ${members2Delete
      ?.map((c) => `${c.name()}(${c.id})`)
      .join('\n')}`
  );

  setTimeout(listener.bind(this), 1e4);
}
