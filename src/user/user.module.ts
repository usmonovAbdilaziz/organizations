import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { BranchModule } from 'src/branch/branch.module';
import { PasswordService } from 'src/auth/utils/password';

@Module({
  imports: [PrismaModule, OrganizationModule, BranchModule],
  controllers: [UserController],
  providers: [UserService, PasswordService],
  exports: [UserService, PasswordService],
})
export class UserModule { }
