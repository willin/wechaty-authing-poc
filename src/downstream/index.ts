import { createBot } from '../lib/bot';
import ready from './ready';

const bot = createBot(process.env.PADLOCAL_TOKEN);

bot
  // add listeners
  .on('ready', ready);

bot.start();
