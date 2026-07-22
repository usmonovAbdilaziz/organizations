import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GlobalServiceService } from './global-service.service';
import { CreateGlobalServiceDto } from './dto/create-global-service.dto';
import { UpdateGlobalServiceDto } from './dto/update-global-service.dto';

@Controller('global-service')
export class GlobalServiceController {
  constructor(private readonly globalServiceService: GlobalServiceService) {}

  @Post()
  create(@Body() createGlobalServiceDto: CreateGlobalServiceDto) {
    return this.globalServiceService.create(createGlobalServiceDto);
  }

  @Get()
  findAll() {
    return this.globalServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalServiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGlobalServiceDto: UpdateGlobalServiceDto) {
    return this.globalServiceService.update(id, updateGlobalServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalServiceService.remove(id);
  }
}
