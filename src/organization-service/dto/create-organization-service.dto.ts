import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateOrganizationServiceDto {
  @ApiProperty({
    example: 'cmf8xv7g50000abcd12345678',
    description: 'Organization ID',
  })
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({
    example: [
      'cmf9abc123456789',
      'cmf9def987654321',
      'cmf9xyz456123789',
    ],
    description: 'Service IDs',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  serviceIds!: string[];
}