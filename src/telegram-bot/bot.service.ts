import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot } from 'grammy';
import { TelegramController } from './bot.controller';

const bot = new Bot(process.env.BOT_TOKEN!);

@Injectable()
export class TelegramService implements OnModuleInit {
  private started = false;

  constructor(private readonly telegramController: TelegramController) {}

  onModuleInit() {
    this.start();
  }

  async start() {
    if (this.started) return;

    // /start [phone] — deep link
    bot.command('start', async (ctx) => {
      await this.telegramController.start(ctx);
    });

    // Matnli xabarlar
    bot.on('message:text', async (ctx) => {
      await this.telegramController.handleText(ctx);
    });

    // Kontakt yuborilganda
    bot.on('message:contact', async (ctx) => {
      await this.telegramController.handleContact(ctx);
    });

    // Inline tugmalar — parolni tiklash
    bot.callbackQuery(/.*/, async (ctx) => {
      await this.telegramController.handleCallback(ctx);
    });

    // Noma'lum buyruqlar
    bot.on('message', async (ctx) => {
      if (ctx.message.text?.startsWith('/')) {
        await this.telegramController.unknown(ctx);
      }
    });

    this.started = true;
    bot
      .start()
      .then(() => console.log('Bot stopped'))
      .catch((err) => console.error('Bot error:', err));
  }
}