import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @ApiProperty({ example: 'Chilonzor filiali' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Toshkent, Chilonzor 5' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 41.2995 })
  @Type(() => Number)
  @IsNumber()
  lat!: number;

  @ApiPropertyOptional({ example: 69.2401 })
  @Type(() => Number)
  @IsNumber()
  long!: number;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({required:true})
  @IsNumber()
  @Type(() => Number)
  code!: number

  @ApiPropertyOptional({ example: '09:00-22:00' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiProperty({ example: 'clx123abc...' })
  @IsString()
  @IsNotEmpty()
  organizationId!: string;
}