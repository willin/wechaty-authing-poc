import { ManagementClient } from 'authing-js-sdk';

export default new ManagementClient({
  userPoolId: process.env.AUTHING_USER_POOL_ID,
  secret: process.env.AUTHING_USER_POOL_SECRET
});
