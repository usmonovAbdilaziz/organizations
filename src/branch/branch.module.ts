import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports:[PrismaModule,OrganizationModule],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
