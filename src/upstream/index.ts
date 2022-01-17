import { createBot } from '../lib/bot';
import roomJoin from './room-join';
import roomLeave from './room-leave';
import message from './message';

const bot = createBot(process.env.PADLOCAL_TOKEN);

bot
  // add listeners
  .on('room-join', roomJoin)
  .on('room-leave', roomLeave)
  .on('message', message);

bot.start();
