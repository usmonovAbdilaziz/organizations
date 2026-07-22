import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @ApiProperty({ example: 'Chilonzor filiali' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: 'Toshkent, Chilonzor 5' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ example: 41.2995 })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @ApiPropertyOptional({ example: 69.2401 })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  long!: number;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ required: true })
  @IsNumber()
  @Type(() => Number)
  code!: number;

  @ApiPropertyOptional({ example: 'dsdjksahfqowieq897d96...' })
  @IsNotEmpty()
  @IsString()
  regionId!: string;

  @ApiPropertyOptional({ example: 'dsdjksahfqowieq897d96...' })
  @IsNotEmpty()
  @IsString()
  districtId!: string;

  @ApiPropertyOptional({ example: 'dsdjksahfqowieq897d96...' })
  @IsArray()
  @IsString()
  emails!: string[];

  @ApiProperty({ example: 'clx123abc...' })
  @IsString()
  @IsNotEmpty()
  organizationId!: string;
}