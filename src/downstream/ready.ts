import type { Wechaty } from 'wechaty';
import { log } from 'wechaty';
// eslint-disable-next-line import/no-extraneous-dependencies
import { filterContactUsers } from 'wechaty-authing';
import { authing } from '../lib/wechaty-authing';
import { listener } from './crontab';

async function createRoom(this: Wechaty): Promise<void> {
  const name = await authing.getPoolName();

  const users = await authing.getAuthingUsers();
  const allFriends = await this.Contact.findAll();
  // 筛选出用户中的好友
  const friends = filterContactUsers(allFriends, users);
  if (friends.length < 2) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(createRoom.bind(this), 3e4);
    return;
  }
  // 创建群聊
  log.info(name, `members2Invite: ${friends.length}`);
  log.info(name, `Inviting ${friends.map((x) => x.name()).join(',')} `);
  // 创建群聊
  const newRoom = await this.Room.create(friends, name);
  await newRoom.ready();
  await newRoom.say('自动创建群聊');
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  listener.bind(this)();
}

export default async function ready(this: Wechaty): Promise<void> {
  // 判断群聊是否存在
  const name = await authing.getPoolName();
  const room = await this.Room.find({
    topic: name
  });

  if (!room) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createRoom.bind(this)();
  } else {
    // 启动侦听钩子
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    listener.bind(this)();
  }
}
