import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TelegramController } from './bot.controller';
import { TelegramService } from './bot.service';

@Module({
  imports: [UserModule],
  providers: [TelegramService, TelegramController],
})
export default class TelegramModule {}
