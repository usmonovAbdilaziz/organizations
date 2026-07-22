import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationServiceDto } from './dto/create-organization-service.dto';
import { UpdateOrganizationServiceDto } from './dto/update-organization-service.dto';
import { PrismaService } from 'src/prisma/prisma';
import { errorResponse } from 'src/utils/response';

@Injectable()
export class OrganizationServiceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateOrganizationServiceDto) {
    try {
      const { organizationId, serviceIds } = dto;

      const organization = await this.prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      const services = await this.prisma.service.findMany({
        where: {
          id: {
            in: serviceIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (services.length !== serviceIds.length) {
        throw new NotFoundException('One or more services not found');
      }

      await this.prisma.organizationService.createMany({
        data: serviceIds.map((serviceId) => ({
          organizationId,
          serviceId,
        })),
        skipDuplicates: true,
      });

      return this.findOne(organizationId);
    } catch (error) {
      errorResponse(error);
    }
  }

 async findAll() {
  try {
    return await this.prisma.organizationService.findMany({
      include: {
        organization: true,
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    errorResponse(error);
  }
}

 async findOne(organizationId: string) {
  try {
    return await this.prisma.organizationService.findMany({
      where: {
        organizationId,
      },
      include: {
        service: true,
      },
    });
  } catch (error) {
    errorResponse(error);
  }
}

 async update(
  organizationId: string,
  dto: UpdateOrganizationServiceDto,
) {
  try {
    await this.prisma.$transaction(async (tx) => {
      await tx.organizationService.deleteMany({
        where: {
          organizationId,
        },
      });

      await tx.organizationService.createMany({
        data: (dto.serviceIds as string[]).map((serviceId) => ({
          organizationId,
          serviceId,
        })),
        skipDuplicates: true,
      });
    });

    return this.findOne(organizationId);
  } catch (error) {
    errorResponse(error);
  }
}

 async remove(
  organizationId: string,
  serviceId: string,
) {
  try {
    await this.prisma.organizationService.delete({
      where: {
        organizationId_serviceId: {
          organizationId,
          serviceId,
        },
      },
    });

    return {
      message: 'Service removed successfully',
    };
  } catch (error) {
    errorResponse(error);
  }
}
}
