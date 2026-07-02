import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationStructure, OrganizationType } from '@prisma/client';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'My Restaurant' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: true, example: 123456789 })
  @IsNumber()
  @Min(100000000, {
    message: 'INN must be 9 digits',
  })
  @Max(999999999, {
    message: 'INN must be 9 digits',
  })
  inn!: number;

  @ApiProperty({ required: true, example: "MCHJ" })
  @IsEnum(OrganizationStructure)
  orgStructure!: OrganizationStructure;

  @ApiProperty({ enum: OrganizationType })
  @IsEnum(OrganizationType)
  type!: OrganizationType;

  @ApiPropertyOptional({ example: 'Best restaurant in city' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'clx123abc...' })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
