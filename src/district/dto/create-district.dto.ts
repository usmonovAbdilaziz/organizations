import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSeoDto } from 'src/seo/dto/create-seo.dto';

export class CreateDistrictDto {
    @ApiProperty({ example: "chilonzor" })
    @IsNotEmpty()
    @IsString()
    slug!: string

    @ApiProperty({ example: "Chilonzor" })
    @IsNotEmpty()
    @IsString()
    nameUz!: string

    @ApiProperty({ example: "Чиланзар" })
    @IsOptional()
    @IsString()
    nameRu?: string

    @ApiProperty({ example: "Chilonzor" })
    @IsOptional()
    @IsString()
    nameEn?: string

    @ApiProperty({ example: "region-id" })
    @IsNotEmpty()
    @IsString()
    regionId!: string

    @ApiPropertyOptional({
        type: CreateSeoDto,
        description: 'Optional SEO metadata. If not provided, will be auto-generated.',
    })
    @IsOptional()
    @ValidateNested()
    seo?: CreateSeoDto;
}
