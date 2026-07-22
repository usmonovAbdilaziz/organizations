import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateWorkingScheduleItemDto } from './create-working-schedule.dto';

export class CreateWorkingScheduleDto {
  @ApiProperty({
    example: 'clz8xv7g50000abcd12345678',
  })
  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @ApiProperty({
    type: [CreateWorkingScheduleItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingScheduleItemDto)
  schedules!: CreateWorkingScheduleItemDto[];
}