import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationStructure, OrganizationType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'My Restaurant',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 123456789,
    description: '9 xonali INN',
  })
  @Type(() => Number)
  @IsInt()
  @Min(100000000, {
    message: 'INN must be 9 digits',
  })
  @Max(999999999, {
    message: 'INN must be 9 digits',
  })
  inn!: number;

  @ApiProperty({
    enum: OrganizationStructure,
    example: OrganizationStructure.MCHJ,
  })
  @IsEnum(OrganizationStructure)
  orgStructure!: OrganizationStructure;

  @ApiProperty({
    enum: OrganizationType,
    example: OrganizationType.RESTAURANT,
  })
  @IsEnum(OrganizationType)
  type!: OrganizationType;

  @ApiPropertyOptional({
    example: 'Best restaurant in the city',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({
    example: 'https://example.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    example: 'cmf6r2v7g0000abc123xyz',
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: CreateSeoDto,
    description: 'Optional SEO metadata. If not provided, will be auto-generated.',
  })
  @IsOptional()
  @ValidateNested()
  seo?: CreateSeoDto;
}