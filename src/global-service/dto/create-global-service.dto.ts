import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateGlobalServiceDto {
  @ApiProperty({
    example: 'cmf8xv7g50000abcd12345678',
    description: 'Category ID',
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({
    example: 'Soch olish',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nameUz!: string;

  @ApiProperty({
    example: 'Стрижка',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nameRu!: string;

  @ApiProperty({
    example: 'Haircut',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nameEn!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icons/haircut.svg',
  })
  @IsOptional()
  @IsUrl()
  icon?: string;

  @ApiPropertyOptional({
    example: "Erkaklar va ayollar uchun professional soch olish xizmati.",
  })
  @IsOptional()
  @IsString()
  descriptionUz?: string;

  @ApiPropertyOptional({
    example: "Профессиональная стрижка для мужчин и женщин.",
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Professional haircut service for men and women.',
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;
}