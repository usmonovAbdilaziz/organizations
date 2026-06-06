import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ example: "Milliy taomlar" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "milliy-taomlar" })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: "🍽️" })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: "clx123abc..." })
  @IsOptional()
  @IsString()
  parentId?: string;
}
