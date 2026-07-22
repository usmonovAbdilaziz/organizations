import { Module } from '@nestjs/common';
import { OrganizationServiceService } from './organization-service.service';
import { OrganizationServiceController } from './organization-service.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [OrganizationServiceController],
  providers: [OrganizationServiceService],
})
export class OrganizationServiceModule {}
