import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { UserRole } from "@prisma/client";

export class UpdateRoleDto{
  @ApiProperty({
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}