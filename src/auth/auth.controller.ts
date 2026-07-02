import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Username va parol orqali login — access_token qaytaradi
   */
  @Post('login')
  @ApiOperation({ summary: 'Username va parol orqali login' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  /**
   * GET /auth/me
   * Bearer tokendan foydalanuvchi ma'lumotlarini olish (relationlari bilan)
   */
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Token orqali joriy foydalanuvchi ma\'lumotlari' })
  async me(@Headers('authorization') authorization: string) {
    const token = authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw new UnauthorizedException('Token taqdim etilmagan');
    }

    return this.authService.me(token);
  }
}
