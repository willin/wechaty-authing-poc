import type { Friendship, Wechaty } from 'wechaty';
import { log } from 'wechaty';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FriendshipType } from 'wechaty-puppet';
import authing from '../lib/authing';
import { sleep } from '../lib/utils';

export default async function ready(
  this: Wechaty,
  friendship: Friendship
): Promise<void> {
  if (friendship.type() !== FriendshipType.Receive) return;

  const phone = friendship.hello().match(/\d{11}/)?.[0];
  if (!phone) return;
  log.info('Friendship', phone);

  const exists = await authing.users.exists({ phone });
  if (!exists) return;
  await friendship.accept();
  await sleep(2000);
  log.info('Friendship', friendship.contact().id);
  const { name } = await authing.userpool.detail();
  const room = await this.Room.find({
    topic: name
  });
  await room?.add(friendship.contact());
}
