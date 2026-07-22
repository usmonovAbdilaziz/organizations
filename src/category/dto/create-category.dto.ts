import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateCategoryDto {
  @ApiPropertyOptional({
    example: 'cmf123456789',
    description: 'Parent category ID',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    example: 'construction',
    description: 'Unique SEO slug',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug!: string;

  @ApiPropertyOptional({
    example: '/uploads/icons/construction.svg',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    example: '/uploads/images/construction.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number = 0;

  @ApiPropertyOptional({
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false;

  // --------------------
  // Names
  // --------------------

  @ApiProperty({
    example: "Qurilish",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nameUz!: string;

  @ApiPropertyOptional({
    example: "Строительство",
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  nameRu?: string;

  @ApiPropertyOptional({
    example: "Construction",
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  nameEn?: string;

  // --------------------
  // Short Description
  // --------------------

  @ApiPropertyOptional({
    example: "Qurilish kompaniyalari",
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  shortDescriptionUz?: string;

  @ApiPropertyOptional({
    example: "Строительные компании",
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  shortDescriptionRu?: string;

  @ApiPropertyOptional({
    example: "Construction companies",
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  shortDescriptionEn?: string;

  // --------------------
  // Description
  // --------------------

  @ApiPropertyOptional({
    example: "Qurilish sohasi bo'yicha barcha tashkilotlar...",
  })
  @IsString()
  @IsOptional()
  descriptionUz?: string;

  @ApiPropertyOptional({
    example: "Все строительные организации...",
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: "All construction companies...",
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({
    type: CreateSeoDto,
    description: 'Optional SEO metadata. If not provided, will be auto-generated.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSeoDto)
  seo?: CreateSeoDto;
}