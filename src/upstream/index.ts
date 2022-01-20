import { createBot } from '../lib/bot';
import roomJoin from './room-join';
import roomLeave from './room-leave';
import message from './message';
import ready from './ready';

const bot = createBot(process.env.WECHATY_PADLOCAL_TOKEN);

bot
  // add listeners
  .on('ready', ready)
  .on('room-join', roomJoin)
  .on('room-leave', roomLeave)
  .on('message', message);

bot.start();
