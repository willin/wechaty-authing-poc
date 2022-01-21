import { WechatyPlugin, Wechaty, log } from 'wechaty';
import { WechatyAuthing } from 'wechaty-authing';
import { createBot } from '../lib/bot';

class ExtendedWechatyAuthing extends WechatyAuthing {
  async totalUsers(): Promise<number> {
    const { totalCount } = await this.client.users.list();
    return totalCount;
  }

  plugin(): WechatyPlugin {
    return (bot: Wechaty): void => {
      bot.on('ready', async () => {
        const totalCount = await this.totalUsers();
        log.info('total users', totalCount);
      });
    };
  }
}

export const authing = new ExtendedWechatyAuthing({
  userPoolId: process.env.AUTHING_USER_POOL_ID,
  secret: process.env.AUTHING_USER_POOL_SECRET
});

const bot = createBot(process.env.WECHATY_PADLOCAL_TOKEN);

bot.use(authing.plugin());

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.start();
