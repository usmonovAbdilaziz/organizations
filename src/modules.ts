import { OrganizationServiceModule } from './organization-service/organization-service.module';
import { GlobalServiceModule } from './global-service/global-service.module';
import { OrganizationModule } from './organization/organization.module';
import { WorkinHoursModule } from './workin-hours/workin-hours.module';
import { CategoryModule } from './category/category.module';
import { GalleryModule } from './gallery/gallery.module';
import { ServiceModule } from './service/service.module';
import TelegramModule from './telegram-bot/bot.module';
import { PrismaModule } from './prisma/prisma.module';
import { BranchModule } from './branch/branch.module';
import { PublicModule } from './public/public.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SeoModule } from './seo/seo.module';
import { RegionModule } from './region/region.module';
import { DistrictModule } from './district/district.module';

export const modules = [
  SeoModule,
  AuthModule,
  UserModule,
  ReviewModule,
  PublicModule,
  PrismaModule,
  BranchModule,
  GalleryModule,
  ServiceModule,
  CategoryModule,
  RegionModule,
  DistrictModule,
  TelegramModule,
  WorkinHoursModule,
  OrganizationModule,
  GlobalServiceModule,
  OrganizationServiceModule,
];
