import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma';
import { errorResponse } from 'src/utils/response';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationService: PrismaService,
    private readonly categoryService: PrismaService,
  ) {}
  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      const { name, categoryId, inn } = createOrganizationDto;
      const exists = await this.organizationService.organization.findFirst({
        where: { OR: [{ name }, { inn }] },
      });
      if (exists) {
        throw new ConflictException(
          'Organization with this name or inn already exists',
        );
      }
      const category = await this.categoryService.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const newOrganization =
        await this.organizationService.organization.create({
          data: createOrganizationDto,
        });
      return newOrganization;
    } catch (error) {
      errorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      const organization =
        await this.organizationService.organization.findUnique({
          where: { id },
          include: {
            users: true,
            branches: true,
          },
        });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      return organization;
    } catch (error) {
      errorResponse(error);
    }
  }
  async findByNameINN(name?: string, inn?: number) {
    try {
      if (name === undefined && inn === undefined) {
        return await this.organizationService.organization.findMany({
          include: { users: true, branches: true },
        });
      }
      const filters: any[] = [];

      if (name) {
        filters.push({ name: { contains: name, mode: 'insensitive' } });
      }
      if (inn !== undefined && inn !== null) {
        filters.push({ inn });
      }
      if (filters.length === 0) {
        return await this.organizationService.organization.findMany();
      }
      return await this.organizationService.organization.findMany({
        where: { OR: filters },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      const org = await this.findOne(id);
      return await this.organizationService.organization.update({
        where: { id },
        data: {
          ...updateOrganizationDto,
          inn: org?.inn,
          categoryId: org?.categoryId,
        },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.organizationService.organization.delete({
        where: { id },
      });
    } catch (error) {
      errorResponse(error);
    }
  }
}
