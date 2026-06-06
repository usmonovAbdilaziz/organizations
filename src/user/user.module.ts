import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { BranchModule } from 'src/branch/branch.module';

@Module({
  imports: [PrismaModule,OrganizationModule,BranchModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
