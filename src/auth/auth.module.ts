import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenService } from 'src/utils/token';
import { PasswordService } from './utils/password';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService,PasswordService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
