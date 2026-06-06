import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    fullName!: string;

    @ApiProperty({ example: "937777453" })
    @IsNotEmpty()
    @Matches(/^\d{9}$/, {
        message: "Phone number must be exactly 9 digits",
    })
    phoneNumber!: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    username!: string

    @ApiProperty({
        enum: UserRole,
        example: UserRole.CLIENT,
        required: false,
    })
    @IsEnum(UserRole)
    role!: UserRole;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    organizationId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    branchId?: string;
}
