import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrganizationServiceService } from './organization-service.service';
import { CreateOrganizationServiceDto } from './dto/create-organization-service.dto';
import { UpdateOrganizationServiceDto } from './dto/update-organization-service.dto';

@Controller('organization-service')
export class OrganizationServiceController {
  constructor(
    private readonly organizationServiceService: OrganizationServiceService,
  ) {}

  @Post()
  create(@Body() createOrganizationServiceDto: CreateOrganizationServiceDto) {
    return this.organizationServiceService.create(createOrganizationServiceDto);
  }

  @Get()
  findAll() {
    return this.organizationServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationServiceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationServiceDto: UpdateOrganizationServiceDto,
  ) {
    return this.organizationServiceService.update(
      id,
      updateOrganizationServiceDto,
    );
  }

  @Delete(':id/service/:serviceId')
  remove(@Param('id') id: string, @Param('serviceId') serviceId: string) {
    return this.organizationServiceService.remove(id, serviceId);
  }
}
