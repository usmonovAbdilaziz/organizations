import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryModule } from 'src/category/category.module';
import { AuthModule } from 'src/auth/auth.module';
import { SeoModule } from 'src/seo/seo.module';

@Module({
  imports:[PrismaModule,CategoryModule,AuthModule,SeoModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
