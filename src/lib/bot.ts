import { log, Wechaty, qrcodeValueToImageUrl, ScanStatus } from 'wechaty';
import type { Contact } from 'wechaty';
import { PuppetPadlocal } from 'wechaty-puppet-padlocal';
import { DingDong } from 'wechaty-plugin-contrib';
import QRCode from 'qrcode-terminal';

/**
 * Create Wechaty Bot with Padlocal
 * @param token
 * @param name
 * @returns
 */
export function createBot(token = '', name = 'AuthingWechatyBot'): Wechaty {
  const puppet = new PuppetPadlocal({
    token
  });

  const bot = new Wechaty({
    name,
    puppet
  });

  bot.use(
    DingDong({
      mention: true,
      ding: '在吗',
      dong: '在呢'
    })
  );

  bot
    .on('scan', (qrcode: string, status: ScanStatus) => {
      if (status === ScanStatus.Waiting && qrcode) {
        log.info(
          bot.name(),
          'onScan() [%s] %s\nScan QR Code above to log in.',
          status,
          qrcodeValueToImageUrl(qrcode)
        );
        QRCode.generate(qrcode, { small: true });
      } else {
        log.info(bot.name(), `onScan: ${ScanStatus[status]}(${status})`);
      }
    })

    .on('login', (user: Contact) => {
      log.info(bot.name(), `${user} login`);
    })

    .on('logout', (user: Contact) => {
      log.info(bot.name(), `${user} logout`);
    });

  return bot;
}
