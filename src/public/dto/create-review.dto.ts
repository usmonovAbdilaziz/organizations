import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'clx123abc...' })
  @IsString()
  organizationId: string;

  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  @MaxLength(120)
  authorName: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false, example: 'Ajoyib xizmat!' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
