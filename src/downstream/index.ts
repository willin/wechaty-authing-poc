import { createBot } from '../lib/bot';
import ready from './ready';
import friendship from './friendship';

const bot = createBot(process.env.WECHATY_PADLOCAL_TOKEN);

bot
  // add listeners
  .on('ready', ready)
  .on('friendship', friendship);

bot.start();
