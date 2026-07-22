import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma';
import { TokenService } from 'src/utils/token';
import { TokenPayload } from 'src/types/token';
import { errorResponse } from 'src/utils/response';
import { PasswordService } from './utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly passwordService:PasswordService
  ) { }

  /**
   * Login — username + password orqali tizimga kirish.
   * Muvaffaqiyatli bo'lsa access_token qaytaradi.
   */
  async login(username: string, passwords: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        include: { organization: true, branch: true },
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      if (!user.password) {
        throw new UnauthorizedException(
          'Parol o\'rnatilmagan. Telegram bot orqali parolni tiklang.',
        );
      }

      const isValid = await this.passwordService.verify(
        user.password,
        passwords,
      );

      if (!isValid) {
        throw new UnauthorizedException('Parol noto\'g\'ri');
      }

      const payload: TokenPayload = {
        id: user.id,
        name: user.fullName ?? user.username,
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // Parol ma'lumotlarini javobdan olib tashlash
      const { password, ...safeUser } = user;

      return {
        access_token: accessToken,
        user: safeUser,
      };
    } catch (error) {
      errorResponse(error);
    }
  }

  /**
   * Auth/Me — tokendan foydalanuvchi ma'lumotlarini olish.
   * Organization va Branch relationlari bilan qaytaradi.
   */
  async me(token: string) {
    try {
      const payload = this.tokenService.verifyAccessToken(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        include: { organization: true, branch: true },
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      // Parol ma'lumotlarini javobdan olib tashlash
      const { password, ...safeUser } = user;

      return safeUser;
    } catch (error) {
      errorResponse(error);
    }
  }

  /**
   * Username bo'yicha foydalanuvchini topish.
   * Parol borligini tekshirish uchun ishlatiladi.
   */
  async findByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      return user;
    } catch (error) {
      errorResponse(error);
    }
  }
}
