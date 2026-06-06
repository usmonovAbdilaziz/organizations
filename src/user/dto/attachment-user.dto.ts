import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class AttachmentUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    organizationId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    branchId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    role?: UserRole;
}