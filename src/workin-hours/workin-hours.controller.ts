import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkinHoursService } from './workin-hours.service';
import { UpdateWorkinHourDto } from './dto/update-workin-hour.dto';
import { CreateWorkingScheduleDto } from './dto/create-wroking.dto';

@Controller('workin-hours')
export class WorkinHoursController {
  constructor(private readonly workinHoursService: WorkinHoursService) {}

  @Post()
  create(@Body() createWorkinHourDto: CreateWorkingScheduleDto) {
    return this.workinHoursService.create(createWorkinHourDto);
  }

  @Get('branch/:branchId')
  findAllBranchId(@Param('branchId')branchId:string) {
    return this.workinHoursService.findAllBranchId(branchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workinHoursService.findOne(id);
  }

  @Patch(':branchId')
  update(@Param('branchId') branchId: string, @Body() updateWorkinHourDto: UpdateWorkinHourDto) {
    return this.workinHoursService.update(branchId, updateWorkinHourDto);
  }

  @Delete(':branchId')
  delete(@Param('branchId') branchId: string) {
    return this.workinHoursService.delete(branchId);
  }
}
