import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { UserService } from 'src/user/user.service';

/**
 * Telegram Bot Controller
 *
 * Bot faqat parolni tiklash uchun ishlaydi:
 *
 * Flow:
 *   1. User /start 937777453 deep link orqali botga kiradi
 *   2. Bot telefon raqam bo'yicha userni topadi
 *   3. "Parolni tiklash" tugmasini ko'rsatadi
 *   4. User yangi parolni kiritadi
 *   5. Bot parolni yangilaydi va username ni qaytaradi
 *   6. User shu username + yangi parol bilan login qiladi
 */
@Injectable()
export class TelegramController {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly userService: UserService,
  ) {}

  /* ──────────────────────────────────────────────
   *  /start
   * ────────────────────────────────────────────── */
  async start(ctx: any) {
    const chatId = ctx.chat.id;
    await this.clearStage(chatId);

    await ctx.reply(
      'Assalomu alaykum!\nDavom etish uchun telefon raqamingizni yuboring (tugmani bosish orqali):',
      {
        reply_markup: {
          keyboard: [[{ text: '📞 Telefon raqamni yuborish', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
  }

  /* ──────────────────────────────────────────────
   *  Kontakt yuborilganda
   * ────────────────────────────────────────────── */
  async handleContact(ctx: any) {
    const chatId = ctx.chat.id;
    let phone = ctx.message?.contact?.phone_number ?? '';
    
    // Telefon raqamni faqat 9 xonali shaklga keltirish (masalan: 998937777453 -> 937777453)
    if (phone.startsWith('+')) phone = phone.slice(1);
    if (phone.length > 9 && phone.startsWith('998')) {
      phone = phone.slice(3);
    }

    if (phone.length !== 9) {
      await ctx.reply('Telefon raqami noto\'g\'ri formatda. Iltimos o\'zbekiston raqamini yuboring.');
      return;
    }

    await this.redis.set(`bot_phone_${chatId}`, phone);

    try {
      const user = await this.userService.findByPhoneNumber(phone);
      if (user) {
        // Foydalanuvchi topildi
        await this.redis.set(`reg_stage_${chatId}`, 'await_new_password');
        await ctx.reply(
          `Sizning hisobingiz topildi (<b>${user.fullName ?? user.username}</b>).\nIltimos, yangi parolni kiriting:`,
          { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } },
        );
      }
    } catch {
      // Foydalanuvchi topilmadi -> Registratsiya boshlanadi
      await this.redis.set(`reg_stage_${chatId}`, 'reg_await_fullname');
      await ctx.reply(
        `Ushbu raqam bazadan topilmadi.\nRo'yxatdan o'tish uchun iltimos <b>To'liq ismingizni (FIO)</b> kiriting:`,
        { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } },
      );
    }
  }

  /* ──────────────────────────────────────────────
   *  Inline tugmalar
   * ────────────────────────────────────────────── */
  async handleCallback(ctx: any) {
    await ctx.reply("Hozircha tugmalar yo'q.");
    await ctx.answerCallbackQuery();
  }

  /* ──────────────────────────────────────────────
   *  Matnli xabar
   * ────────────────────────────────────────────── */
  async handleText(ctx: any) {
    const chatId = ctx.chat.id;
    const text = ctx.message?.text?.trim() ?? '';
    const stage = await this.redis.get(`reg_stage_${chatId}`);

    try {
      if (stage === 'await_new_password') {
        await this.handleNewPassword(ctx, chatId, text);
        return;
      }

      if (stage === 'reg_await_fullname') {
        await this.redis.set(`reg_fullname_${chatId}`, text);
        await this.redis.set(`reg_stage_${chatId}`, 'reg_await_username');
        await ctx.reply('Endi tizimga kirish uchun o\'zingizga <b>username (login)</b> o\'ylab toping (masalan: ali123):', { parse_mode: 'HTML' });
        return;
      }

      if (stage === 'reg_await_username') {
        await this.redis.set(`reg_username_${chatId}`, text);
        await this.redis.set(`reg_stage_${chatId}`, 'reg_await_password');
        await ctx.reply('Ajoyib! Endi hisobingiz uchun <b>parol</b> kiriting (kamida 4 ta belgi):', { parse_mode: 'HTML' });
        return;
      }

      if (stage === 'reg_await_password') {
        await this.registerUser(ctx, chatId, text);
        return;
      }

      await ctx.reply('Iltimos /start orqali boshlang.');
    } catch (error: any) {
      await ctx.reply('Xatolik: ' + (error?.message ?? 'Unknown'));
      await this.clearStage(chatId);
    }
  }

  /* ──────────────────────────────────────────────
   *  Noma'lum buyruq
   * ────────────────────────────────────────────── */
  async unknown(ctx: any) {
    await ctx.reply('/start ni bosing.');
  }

  /* ──────────────────────────────────────────────
   *  PRIVATE METHODS
   * ────────────────────────────────────────────── */

  /** Yangi parolni saqlash (mavjud foydalanuvchi uchun) */
  private async handleNewPassword(ctx: any, chatId: number, password: string) {
    if (password.length < 4) {
      await ctx.reply('Parol kamida 4 ta belgidan iborat bo\'lishi kerak. Qayta kiriting:');
      return;
    }

    const phone = await this.redis.get(`bot_phone_${chatId}`);
    if (!phone) {
      await ctx.reply('Telefon raqam topilmadi.\nIltimos /start orqali qayta boshlang.');
      await this.clearStage(chatId);
      return;
    }

    let user: any;
    try {
      user = await this.userService.findByPhoneNumber(phone);
    } catch {
      await ctx.reply('Foydalanuvchi topilmadi.');
      await this.clearStage(chatId);
      return;
    }

    // Parolni yangilash
    await this.userService.updatePassword(user.id, password);

    await ctx.reply(
      `✅ Parol muvaffaqiyatli yangilandi!\n\n` +
        `🔤 Sizning username: <b>${user.username}</b>\n\n` +
        `Shu username va yangi parol bilan tizimga kiring.`,
      { parse_mode: 'HTML' },
    );

    await this.clearStage(chatId);
  }

  /** Yangi foydalanuvchini ro'yxatdan o'tkazish */
  private async registerUser(ctx: any, chatId: number, password: string) {
    if (password.length < 4) {
      await ctx.reply('Parol kamida 4 ta belgidan iborat bo\'lishi kerak. Qayta kiriting:');
      return;
    }

    const phone = await this.redis.get(`bot_phone_${chatId}`);
    const fullName = await this.redis.get(`reg_fullname_${chatId}`);
    const username = await this.redis.get(`reg_username_${chatId}`);

    if (!phone || !fullName || !username) {
      await ctx.reply('Ma\'lumotlar to\'liq emas.\nIltimos /start orqali qayta boshlang.');
      await this.clearStage(chatId);
      return;
    }

    try {
      // Role sukut bo'yicha 'CLIENT' deb olinadi
      const newUser = await this.userService.create({
        fullName,
        phoneNumber: phone,
        username,
        password,
        role: 'CLIENT' as any,
      });

      if (!newUser) {
        throw new Error('Yaratishda xatolik');
      }

      await ctx.reply(
        `🎉 Muvaffaqiyatli ro'yxatdan o'tdingiz!\n\n` +
          `👤 Ism: <b>${fullName}</b>\n` +
          `🔤 Username: <b>${username}</b>\n\n` +
          `Endi ushbu login va parol orqali tizimga kirishingiz mumkin.`,
        { parse_mode: 'HTML' },
      );
    } catch (err: any) {
      await ctx.reply(`Ro'yxatdan o'tishda xatolik: ${err?.message ?? 'Unknown'}`);
    }

    await this.clearStage(chatId);
  }

  /** Redis dan bosqich ma'lumotlarini tozalash */
  private async clearStage(chatId: number) {
    await this.redis.del(`reg_stage_${chatId}`);
    await this.redis.del(`bot_phone_${chatId}`);
    await this.redis.del(`reg_fullname_${chatId}`);
    await this.redis.del(`reg_username_${chatId}`);
  }
}
