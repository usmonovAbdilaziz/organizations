import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateServiceDto {
    @ApiProperty({ example: "a98ds98ad7as9d87f9a8" })
    @IsNotEmpty()
    @IsString()
    categoryId!: string

    @ApiProperty({ example: "medical" })
    @IsNotEmpty()
    @IsString()
    slug!: string

    @ApiProperty({ example: "Tibbiyot" })
    @IsNotEmpty()
    @IsString()
    nameUz!: string

    @ApiPropertyOptional({ example: "Meditsina" })
    @IsOptional()
    @IsString()
    nameEn?: string

    @ApiPropertyOptional({ example: "Лекарство" })
    @IsOptional()
    @IsString()
    nameRu?: string

    @ApiPropertyOptional({ example: "Eng zur shifoxona" })
    @IsOptional()
    @IsString()
    descriptionUz?: string

    @ApiPropertyOptional({ example: "Лучшая больница" })
    @IsOptional()
    @IsString()
    descriptionRu?: string

    @ApiPropertyOptional({ example: "The best hospital" })
    @IsOptional()
    @IsString()
    descriptionEn?: string

    @ApiPropertyOptional({
        type: CreateSeoDto,
        description: 'Optional SEO metadata. If not provided, will be auto-generated.',
    })
    @IsOptional()
    @ValidateNested()
    seo?: CreateSeoDto;
}
