import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { WeekDay } from '@prisma/client';
import { CreateWorkingPeriodDto } from './crate-working-period.dto';

export class CreateWorkingScheduleItemDto {
  @ApiProperty({
    enum: WeekDay,
    isArray: true,
    example: [
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
    ],
  })
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  days!: WeekDay[];

  @ApiProperty({
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean = false;

  @ApiProperty({
    type: [CreateWorkingPeriodDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingPeriodDto)
  periods!: CreateWorkingPeriodDto[];
}