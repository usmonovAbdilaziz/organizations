import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { OrganizationModule } from './organization/organization.module';
import { BranchModule } from './branch/branch.module';
import { CategoryModule } from './category/category.module';
import TelegramModule from './telegram-bot/bot.module';
import { AuthModule } from './auth/auth.module';

export const modules = [
  PrismaModule,
  UserModule,
  OrganizationModule,
  BranchModule,
  CategoryModule,
  TelegramModule,
  AuthModule,
];
