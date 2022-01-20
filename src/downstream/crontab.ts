import { Contact, log, Wechaty } from 'wechaty';
// eslint-disable-next-line import/no-extraneous-dependencies
import { contactDiff, filterContactUsers } from 'wechaty-authing';
import { ContactType } from 'wechaty-puppet';
import { sleep } from '../lib/utils';
import { authing } from '../lib/wechaty-authing';

const SYSTEMIDS = ['floatbottle', 'fmessage', 'medianote', 'weixin'];

export async function listener(this: Wechaty): Promise<void> {
  const name = await authing.getPoolName();
  const room = await this.Room.find({
    topic: name
  });
  /* eslint-disable no-await-in-loop */
  if (room!) {
    const memberList = await room.memberAll();
    log.verbose(name, `Current group members: ${memberList.length}`);
    const { registered } = await authing.filterAuthingUsers(memberList);

    const members2Delete = contactDiff(memberList, registered);
    if (members2Delete.length > 0) {
      log.info(name, `members2Delete: ${members2Delete.length}`);
      await room.say(
        `准备删除成员：\n ${members2Delete
          .map((c) => `${c.name()}(${c.id})`)
          .join('\n')}`
      );

      const members2Warning: Contact[] = [];

      for (let i = 0; i < members2Delete.length; i += 1) {
        const member = members2Delete[i];
        // if (member.friend()) {
        //   // eslint-disable-next-line
        //   await (this.puppet as any).contactDelete?.(member);
        // }
        await sleep(500);
        await room?.del(member);
      }

      if (members2Warning.length > 0) {
        log.info(name, `members2Warning: ${members2Warning.length}`);
        // 可以私发管理员通知
        await room.say(
          `警告需要手动确认状态：\n ${members2Warning
            .map((c) => `${c.name()}(${c.id})`)
            .join('\n')}`
        );
      }
    }

    const users = await authing.getAuthingUsers();
    const allContacts = await this.Contact.findAll();
    const allFriends = allContacts.filter(
      (contact) =>
        contact.friend() &&
        contact.type() === ContactType.Individual &&
        !SYSTEMIDS.includes(contact.id)
    );
    // 筛选出用户中的好友
    const friends = filterContactUsers(allFriends, users);
    // const friends2Delete = filterContactUsers(allFriends, users, false);
    // // 删除异常好友
    // if (friends2Delete.length > 0) {
    //   log.info(
    //     'friends2Delete',
    //     `${friends2Delete.length}: ${friends2Delete
    //       .map((c) => c.name())
    //       .join(',')}`
    //   );
    //   await Promise.allSettled(
    //     // eslint-disable-next-line
    //     friends2Delete.map((c) => (this.puppet as any).contactDelete?.(c))
    //   );
    // }
    // 检查未入群的好友
    const members2Invite = contactDiff(friends, memberList);

    if (members2Invite.length > 0) {
      // 邀请入群
      await room.say(
        `正在邀请入群：\n ${members2Invite
          .map((c) => `${c.name()}(${c.id})`)
          .join('\n')}`
      );

      for (let i = 0; i < members2Invite.length; i += 1) {
        const member = members2Invite[i];
        await sleep(500);
        await room.add(member);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setTimeout(listener.bind(this), 3e4);
}
