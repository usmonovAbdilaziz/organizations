import { PartialType } from '@nestjs/swagger';
import { CreateWorkingScheduleDto } from './create-wroking.dto';

export class UpdateWorkinHourDto extends PartialType(CreateWorkingScheduleDto) {}
