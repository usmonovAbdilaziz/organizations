import { Module } from '@nestjs/common';
import { GlobalServiceService } from './global-service.service';
import { GlobalServiceController } from './global-service.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [GlobalServiceController],
  providers: [GlobalServiceService],
})
export class GlobalServiceModule {}
