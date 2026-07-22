import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateRegionDto {
    @ApiProperty({ example: "toshkent" })
    @IsNotEmpty()
    @IsString()
    slug!: string

    @ApiProperty({ example: "Toshkent" })
    @IsNotEmpty()
    @IsString()
    nameUz!: string

    @ApiProperty({ example: "Ташкент" })
    @IsOptional()
    @IsString()
    nameRu?: string

    @ApiProperty({ example: "Tashkent" })
    @IsOptional()
    @IsString()
    nameEn?: string

    @ApiPropertyOptional({
        type: CreateSeoDto,
        description: 'Optional SEO metadata. If not provided, will be auto-generated.',
    })
    @IsOptional()
    @ValidateNested()
    seo?: CreateSeoDto;
}
