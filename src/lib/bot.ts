import { Contact, log, ScanStatus, Wechaty } from 'wechaty';
import { PuppetPadlocal } from 'wechaty-puppet-padlocal';
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

  bot
    .on('scan', (qrcode: string, status: ScanStatus) => {
      if (status === ScanStatus.Waiting && qrcode) {
        QRCode.generate(qrcode, { small: true });
        const qrcodeImageUrl = [
          'https://api.qrserver.com/v1/create-qr-code/?data=',
          encodeURIComponent(qrcode)
        ].join('');
        log.info(
          bot.name(),
          `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`
        );
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
