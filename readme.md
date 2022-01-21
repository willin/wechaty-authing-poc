# Wechaty Authing 集成 POC

- [Wechaty Authing 集成 POC](#wechaty-authing-集成-poc)
  - [CONTRIBUTING](#contributing)
  - [插件扩展开发示例](#插件扩展开发示例)
    - [Wechaty Plugin](#wechaty-plugin)
    - [Extends with Authing API](#extends-with-authing-api)
    - [使用](#使用)
  - [以微信群作为上游数据源](#以微信群作为上游数据源)
    - [管理员邀请用户加入群组（人为操作）](#管理员邀请用户加入群组人为操作)
    - [管理员踢出群聊用户（人为操作）](#管理员踢出群聊用户人为操作)
    - [用户 @Bot 提及消息](#用户-bot-提及消息)
  - [以 Authing 作为上游数据源](#以-authing-作为上游数据源)

## CONTRIBUTING

Fork this repo.

Set env:

```bash
export AUTHING_USER_POOL_ID="xxx"
export AUTHING_USER_POOL_SECRET="xxx"
export WECHATY_PADLOCAL_TOKEN="xxx"
export WECHATY_ROOM_ID="19115444039@chatroom"
```

## 插件扩展开发示例

```bash
npm run start:plugin
```

本地开发：

```bash
# 导入类型
yarn add --dev authing-js-sdk
```

### Wechaty Plugin

```ts
class ExtendedWechatyAuthing extends WechatyAuthing {
  plugin(): WechatyPlugin {
    return (bot: Wechaty): void => {
      bot.on('ready', async () => {
        const { totalCount } = await this.client.users.list();
        log.info('total users', totalCount);
      });
    };
  }
}
```

### Extends with Authing API

```ts
class ExtendedWechatyAuthing extends WechatyAuthing {
  async totalUsers(): Promise<number> {
    const { totalCount } = await this.client.users.list();
    return totalCount;
  }
}
```

### 使用

```ts
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
```

## 以微信群作为上游数据源

```bash
npm run start:upstream
```

启动时：

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggTFJcbiAgICBTdGFydDEoU3RhcnQpIFxuICAgIC0tQm90IOWQr-WKqC0tPiBjaGVjazFb5qOA5p-l576k5YaF55qE6Z2eIEF1dGhpbmcg55So5oi3XVxuICAgIC0tPiBhZGRVc2VyW-a3u-WKoCBBdXRoaW5nIOeUqOaIt-W5tua2iOaBr-aPkOmGkue7keWumuaJi-acuuWPt11cbiAgICAtLT4gRW5kMShFbmQpIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid.live/edit#eyJjb2RlIjoiZ3JhcGggTFJcbiAgICBTdGFydDEoU3RhcnQpIFxuICAgIC0tQm90IOWQr-WKqC0tPiBjaGVjazFb5qOA5p-l576k5YaF55qE6Z2eIEF1dGhpbmcg55So5oi3XVxuICAgIC0tPiBhZGRVc2VyW-a3u-WKoCBBdXRoaW5nIOeUqOaIt-W5tua2iOaBr-aPkOmGkue7keWumuaJi-acuuWPt11cbiAgICAtLT4gRW5kMShFbmQpIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBTdGFydDEoU3RhcnQpIFxuICAgIC0tPiBhZGQxW-euoeeQhuWRmOS6uuS4uua3u-WKoOe-pOaIkOWRmF1cbiAgICAtLeeuoeeQhiBCb3Qg5L6m5ZCs5YWl576k5LqL5Lu2LS0-IGFkZDJbQm90IOWQkSBBdXRoaW5nIOazqOWGjOeUqOaIt11cbiAgICAtLeeUqOaIt-aPkOWPiiBCb3Qg5Y-R6YCB5omL5py65Y-3IC0tPiBhZGQzW0JvdCDlkJEgQXV0aGluZyDmm7TmlrDnu5HlrprnlKjmiLfmiYvmnLrlj7ddIFxuICAgIC0tPiBFbmQxKEVuZClcblxuICAgIFN0YXJ0MihTdGFydCkgXG4gICAgLS0-IGRlbDFb566h55CG5ZGY5Lq65Li65Yig6Zmk576k5oiQ5ZGYXVxuICAgIC0t566h55CGIEJvdCDkvqblkKzpgIDnvqTkuovku7YtLT4gIGRlbDJbQm90IOWQkSBBdXRoaW5nIOWIoOmZpOeUqOaIt11cbiAgICAtLT4gRW5kMihFbmQpIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid.live/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBTdGFydDEoU3RhcnQpIFxuICAgIC0tPiBhZGQxW-euoeeQhuWRmOS6uuS4uua3u-WKoOe-pOaIkOWRmF1cbiAgICAtLeeuoeeQhiBCb3Qg5L6m5ZCs5YWl576k5LqL5Lu2LS0-IGFkZDJbQm90IOWQkSBBdXRoaW5nIOazqOWGjOeUqOaIt11cbiAgICAtLeeUqOaIt-aPkOWPiiBCb3Qg5Y-R6YCB5omL5py65Y-3IC0tPiBhZGQzW0JvdCDlkJEgQXV0aGluZyDmm7TmlrDnu5HlrprnlKjmiLfmiYvmnLrlj7ddIFxuICAgIC0tPiBFbmQxKEVuZClcblxuICAgIFN0YXJ0MihTdGFydCkgXG4gICAgLS0-IGRlbDFb566h55CG5ZGY5Lq65Li65Yig6Zmk576k5oiQ5ZGYXVxuICAgIC0t566h55CGIEJvdCDkvqblkKzpgIDnvqTkuovku7YtLT4gIGRlbDJbQm90IOWQkSBBdXRoaW5nIOWIoOmZpOeUqOaIt11cbiAgICAtLT4gRW5kMihFbmQpIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)

Bot 对 Authing 用户的操作通过同步中心向下游数据源进行同步。

### 管理员邀请用户加入群组（人为操作）

侦听 `room-join` 事件触发，获得被邀请人员名单（_inviteeList_）。检查 Authing 用户池，筛选出未注册的用户列表，批量注册用户，并发送消息提示绑定用户手机号。

### 管理员踢出群聊用户（人为操作）

侦听 `room-leave` 事件触发，获得被移除人员名单（_leaverList_）。从 Authing 用户池中批量删除。提示删除成功的用户名（列表）。

如果有删除失败的（不确定原因引起），提示删除失败的用户名（列表），请管理员手动删除。

### 用户 @Bot 提及消息

侦听 `message` 事件触发，如果非提及消息，或者消息中不包含手机号，则不处理。

检查用户是否存在，如果存在，修改绑定的手机号为用户输入的（可能出现重复手机号绑定失败）；如果用户不存在注册一个新用户。

如果绑定成功，发送消息提示。

## 以 Authing 作为上游数据源

```bash
npm run start:downstream
```

用户数据来源也可能是同步中心里来自飞书的用户数据。其中有一步，在 Authing 用户池中添加新用户后，要求用户主动添加 Bot 为好友，必须。

启动时：

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBTdGFydDEoU3RhcnQpIFxuICAgIC0tQm90IOWQr-WKqC0tPiBjaGVjazF75qOA5p-l5YWo5ZGY576k5piv5ZCm5a2Y5ZyofVxuICAgIC0tPnxUfCBzdGFydDJb5ZCv5YqoIDMwcyDova7or6IgQ3JvbkpvYl1cbiAgICAtLT4gRW5kMShFbmQpXG4gICAgY2hlY2sxLS0-fEZ8IGNoZWNrMnvnlKjmiLfkuK3lpb3lj4vmlbDmmK_lkKbotoXov4cgMiDkurp9XG4gICAgLS0-fFR8IHN0ZXAxW-WIm-W7uue-pOe7hF1cbiAgICAtLT4gc3RhcnQyXG4gICAgY2hlY2syLS0-fEYg6Ze06ZqUIDMwcyDlpI3mn6V8IGNoZWNrMlxuXG4gICAgU3RhcnQyKFN0YXJ0KVxuICAgIC0tPiBzdGVwMjFb5p-l6K-i5YWo5ZGY576k5oiQ5ZGYXVxuICAgIC0tPiBzdGVwMjJb562b6YCJ5Ye65LiN5pivIEF1dGhpbmcg55So5oi355qE5oiQ5ZGY5bm26Lii5Ye6XVxuICAgIC0tPiBzdGVwMjNb562b6YCJ5Ye6IEF1dGhpbmcg55So5oi35Lit5LiN5Zyo576k5YaF55qE5aW95Y-L5bm26YKA6K-3XVxuICAgIC0tPiBFbmQyKEVuZClcbiAgICAtLT58MzBzIOi9ruivonwgU3RhcnQyIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid.live/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBTdGFydDEoU3RhcnQpIFxuICAgIC0tQm90IOWQr-WKqC0tPiBjaGVjazF75qOA5p-l5YWo5ZGY576k5piv5ZCm5a2Y5ZyofVxuICAgIC0tPnxUfCBzdGFydDJb5ZCv5YqoIDMwcyDova7or6IgQ3JvbkpvYl1cbiAgICAtLT4gRW5kMShFbmQpXG4gICAgY2hlY2sxLS0-fEZ8IGNoZWNrMnvnlKjmiLfkuK3lpb3lj4vmlbDmmK_lkKbotoXov4cgMiDkurp9XG4gICAgLS0-fFR8IHN0ZXAxW-WIm-W7uue-pOe7hF1cbiAgICAtLT4gc3RhcnQyXG4gICAgY2hlY2syLS0-fEYg6Ze06ZqUIDMwcyDlpI3mn6V8IGNoZWNrMlxuXG4gICAgU3RhcnQyKFN0YXJ0KVxuICAgIC0tPiBzdGVwMjFb5p-l6K-i5YWo5ZGY576k5oiQ5ZGYXVxuICAgIC0tPiBzdGVwMjJb562b6YCJ5Ye65LiN5pivIEF1dGhpbmcg55So5oi355qE5oiQ5ZGY5bm26Lii5Ye6XVxuICAgIC0tPiBzdGVwMjNb562b6YCJ5Ye6IEF1dGhpbmcg55So5oi35Lit5LiN5Zyo576k5YaF55qE5aW95Y-L5bm26YKA6K-3XVxuICAgIC0tPiBFbmQyKEVuZClcbiAgICAtLT58MzBzIOi9ruivonwgU3RhcnQyIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBTdGFydDEoU3RhcnQpXG4gICAgLS1Cb3Qg5ZCv5YqoLS0-IHN0ZXAxMVvkvqblkKzlpb3lj4vnlLPor7flkozmlofmnKzmtojmga9dXG4gICAgLS0-fOWlveWPi-ivt-axguS6i-S7tuaIluaWh-acrOa2iOaBr3wgc3RlcDEyW-agueaNruaJi-acuuWPt-aOpeWPl-ivt-axguW5tumCgOivt-WFpee-pF1cbiAgICAtLT4gRW5kMShFbmQpIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid.live/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBTdGFydDEoU3RhcnQpXG4gICAgLS1Cb3Qg5ZCv5YqoLS0-IHN0ZXAxMVvkvqblkKzlpb3lj4vnlLPor7flkozmlofmnKzmtojmga9dXG4gICAgLS0-fOWlveWPi-ivt-axguS6i-S7tuaIluaWh-acrOa2iOaBr3wgc3RlcDEyW-agueaNruaJi-acuuWPt-aOpeWPl-ivt-axguW5tumCgOivt-WFpee-pF1cbiAgICAtLT4gRW5kMShFbmQpIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)
