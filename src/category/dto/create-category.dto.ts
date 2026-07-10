import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Milliy taomlar' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'milliy-taomlar' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'https://example.com' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: '🍽️' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 'clx123abc...' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
