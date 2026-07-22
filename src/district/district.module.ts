import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeoModule } from 'src/seo/seo.module';

@Module({
  imports: [PrismaModule, SeoModule],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
