import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGlobalServiceDto } from './dto/create-global-service.dto';
import { UpdateGlobalServiceDto } from './dto/update-global-service.dto';
import { PrismaService } from 'src/prisma/prisma';
import slugify from 'slugify';
import { errorResponse } from 'src/utils/response';
@Injectable()
export class GlobalServiceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateGlobalServiceDto) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const slug = slugify(dto.nameEn, {
        lower: true,
        strict: true,
        trim: true,
      });

      const exists = await this.prisma.service.findUnique({
        where: { slug },
      });

      if (exists) {
        throw new ConflictException('Service already exists');
      }

      return await this.prisma.service.create({
        data: {
          ...dto,
          slug,
        },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.service.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async findOne(id: string) {
    try {
      const service = await this.prisma.service.findFirst({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          category: true,
        },
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      return service;
    } catch (error) {
      errorResponse(error);
    }
  }

  async update(id: string, dto: UpdateGlobalServiceDto) {
    try {
      await this.findOne(id);

      if (dto.categoryId) {
        const category = await this.prisma.category.findUnique({
          where: {
            id: dto.categoryId,
          },
        });

        if (!category) {
          throw new NotFoundException('Category not found');
        }
      }

      let slug: string | undefined;

      if (dto.nameEn) {
        slug = slugify(dto.nameEn, {
          lower: true,
          strict: true,
          trim: true,
        });

        const exists = await this.prisma.service.findFirst({
          where: {
            slug,
            NOT: {
              id,
            },
          },
        });

        if (exists) {
          throw new ConflictException('Slug already exists');
        }
      }

      return await this.prisma.service.update({
        where: {
          id,
        },
        data: {
          ...dto,
          ...(slug && { slug }),
        },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      await this.prisma.service.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        message: 'Service deleted successfully',
      };
    } catch (error) {
      errorResponse(error);
    }
  }
}
