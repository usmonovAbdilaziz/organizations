import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import { UpdateRoleDto } from './dto/updateRoleDto0';
import { AttachmentUserDto } from './dto/attachment-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Patch('/attachment/:id')
  updateAttachment(
    @Param('id') id: string,
    @Body() updateUserDto: AttachmentUserDto,
  ) {
    return this.userService.updateAttachment(id, updateUserDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Get('phone-number/:phone')
  findPhonenUmber(@Param('phone') phone: string) {
    return this.userService.findByPhoneNumber(phone);
  }
  @Get('branch/:branchId')
  findStaffOrg(@Param('branchId') branchId: string) {
    return this.userService.findStaffOrg(branchId)
  }
  @Patch('/role/:id')
  updateRole(@Param('id') id: string, @Body() updateRole: UpdateRoleDto) {
    return this.userService.updateRole(id, updateRole);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
