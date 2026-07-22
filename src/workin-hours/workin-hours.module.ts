import { Module } from '@nestjs/common';
import { WorkinHoursService } from './workin-hours.service';
import { WorkinHoursController } from './workin-hours.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [WorkinHoursController],
  providers: [WorkinHoursService],
})
export class WorkinHoursModule {}
