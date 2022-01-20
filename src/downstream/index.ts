import { createBot } from '../lib/bot';
import ready from './ready';
import friendship from './friendship';
import message from './message';

const bot = createBot(process.env.WECHATY_PADLOCAL_TOKEN);

bot
  // add listeners
  .on('ready', ready)
  .on('friendship', friendship)
  .on('message', message);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bot.start();
