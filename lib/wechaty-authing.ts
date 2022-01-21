import { WechatyAuthing } from 'wechaty-authing';

export const authing = new WechatyAuthing({
  userPoolId: process.env.AUTHING_USER_POOL_ID,
  secret: process.env.AUTHING_USER_POOL_SECRET
});
