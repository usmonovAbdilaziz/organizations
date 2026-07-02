import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SearchOrganizationDto } from './dto/search-organization.dto';
import { AuthGuard } from 'src/guards/jwt.auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('organization')
@Roles('ADMIN', 'SUPER_ADMIN', 'ORGANIZATION')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()

  @ApiOperation({ summary: 'Create organization' })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false, description: 'Organization name to search for' })
  @ApiQuery({ name: 'inn', required: false, description: 'Organization INN to search for', type: Number })
  @ApiOperation({ summary: 'Search organizations by name or INN' })
  findByNameINN(@Query() query: SearchOrganizationDto) {
    const { name, inn } = query;
    return this.organizationService.findByNameINN(name, inn);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update organization' })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete organization' })
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
