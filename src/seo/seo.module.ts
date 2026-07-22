import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule {}
