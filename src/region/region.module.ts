import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeoModule } from 'src/seo/seo.module';

@Module({
  imports: [PrismaModule, SeoModule],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
