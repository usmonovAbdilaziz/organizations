import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryModule } from 'src/category/category.module';
import { SeoModule } from 'src/seo/seo.module';

@Module({
  imports:[PrismaModule,CategoryModule,SeoModule],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
