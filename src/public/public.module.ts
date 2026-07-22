import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeoModule } from 'src/seo/seo.module';

@Module({
  imports: [PrismaModule, SeoModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
