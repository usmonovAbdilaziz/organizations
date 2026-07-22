import { ApiProperty } from '@nestjs/swagger';
import { WorkingPeriodType } from '@prisma/client';
import { IsEnum, IsString, Matches } from 'class-validator';

export class CreateWorkingPeriodDto {
  @ApiProperty({
    enum: WorkingPeriodType,
    example: WorkingPeriodType.WORK,
  })
  @IsEnum(WorkingPeriodType)
  periodType!: WorkingPeriodType;

  @ApiProperty({
    example: '09:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime!: string;

  @ApiProperty({
    example: '18:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime!: string;
}