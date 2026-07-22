import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationServiceDto } from './create-organization-service.dto';

export class UpdateOrganizationServiceDto extends PartialType(CreateOrganizationServiceDto) {}
