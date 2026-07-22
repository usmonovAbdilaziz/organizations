import { PartialType } from '@nestjs/swagger';
import { CreateGlobalServiceDto } from './create-global-service.dto';

export class UpdateGlobalServiceDto extends PartialType(CreateGlobalServiceDto) {}
