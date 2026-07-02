import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'mySecurePass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Parol kamida 4 ta belgidan iborat bolishi kerak' })
  password!: string;
}
