import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchOrganizationDto {
  @ApiProperty({
    required: false,
    description: 'Organization name to search for',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Organization INN to search for',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  inn?: number;
}
