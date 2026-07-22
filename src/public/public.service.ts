import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma';
import { errorResponse } from 'src/utils/response';
import { SeoService } from 'src/seo/seo.service';
import { SeoEntity } from '@prisma/client';

const ORG_CARD_SELECT = {
  id: true,
  name: true,
  slug: true,
  type: true,
  logo: true,
  description: true,
  ratingAvg: true,
  ratingCount: true,
  updatedAt: true,
  category: {
    select: { id: true, slug: true, nameUz: true, nameRu: true, nameEn: true },
  },
  branches: {
    take: 1,
    orderBy: { createdAt: 'asc' as const },
    select: {
      id: true,
      name: true,
      address: true,
      lat: true,
      long: true,
      phone: true,
      region: { select: { slug: true, nameUz: true, nameRu: true, nameEn: true } },
      district: { select: { slug: true, nameUz: true, nameRu: true, nameEn: true } },
    },
  },
};

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seoService: SeoService,
  ) {}

  // ---- Categories -----------------------------------------------------------
  async categoryTree() {
    try {
      const all = await this.prisma.category.findMany({
        where: { status: 'ACTIVE' },
        orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
      });
      const byParent = new Map<string | null, any[]>();
      for (const c of all) {
        const key = c.parentId ?? null;
        if (!byParent.has(key)) byParent.set(key, []);
        byParent.get(key)!.push({ ...c, children: [] as any[] });
      }
      const attach = (node: any) => {
        node.children = byParent.get(node.id) ?? [];
        node.children.forEach(attach);
        return node;
      };
      const roots = (byParent.get(null) ?? []).map(attach);
      return roots;
    } catch (error) {
      errorResponse(error);
    }
  }

  async categoryBySlug(slug: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { slug },
        include: {
          parent: true,
          children: {
            where: { status: 'ACTIVE' },
            orderBy: { sortOrder: 'asc' },
          },
          services: true,
        },
      });
      if (!category) throw new NotFoundException('Category not found');
      const organizationCount = await this.prisma.organization.count({
        where: { categoryId: category.id, isActive: true },
      });
      const seo = await this.seoService.findSeo(SeoEntity.CATEGORY, category.id);
      return { ...category, organizationCount, seo };
    } catch (error) {
      errorResponse(error);
    }
  }

  // ---- Regions / Districts --------------------------------------------------
  async regions() {
    try {
      return await this.prisma.region.findMany({
        where: { deletedAt: null },
        orderBy: { nameEn: 'asc' },
        include: { _count: { select: { districts: true, branches: true } } },
      });
    } catch (error) {
      errorResponse(error);
    }
  }

  async regionBySlug(slug: string) {
    try {
      const region = await this.prisma.region.findUnique({
        where: { slug },
        include: {
          districts: {
            where: { deletedAt: null },
            orderBy: { nameEn: 'asc' },
          },
        },
      });
      if (!region) throw new NotFoundException('Region not found');
      const seo = await this.seoService.findSeo(SeoEntity.REGION, region.id);
      return { ...region, seo };
    } catch (error) {
      errorResponse(error);
    }
  }

  async districtBySlug(slug: string) {
    try {
      const district = await this.prisma.district.findUnique({
        where: { slug },
        include: { region: true },
      });
      if (!district) throw new NotFoundException('District not found');
      const seo = await this.seoService.findSeo(SeoEntity.DISTRICT, district.id);
      return { ...district, seo };
    } catch (error) {
      errorResponse(error);
    }
  }

  // ---- Organization detail --------------------------------------------------
  async organizationBySlug(slug: string) {
    try {
      const organization = await this.prisma.organization.findFirst({
        where: { slug, isActive: true },
        include: {
          category: { include: { parent: true } },
          branches: {
            include: {
              region: true,
              district: true,
              WorkingSchedule: { include: { periods: true } },
            },
          },
          organizationServices: { include: { service: true } },
          gallery: { orderBy: { sortOrder: 'asc' } },
          reviews: {
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
        },
      });
      if (!organization) throw new NotFoundException('Organization not found');
      const seo = await this.seoService.findSeo(SeoEntity.ORGANIZATION, organization.id);
      return { ...organization, seo };
    } catch (error) {
      errorResponse(error);
    }
  }

  // ---- Listing (category [+ region] [+ district]) ---------------------------
  async listing(params: {
    category?: string;
    region?: string;
    district?: string;
    q?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = Math.max(1, Number(params.page) || 1);
      const limit = Math.min(60, Math.max(1, Number(params.limit) || 20));

      const where: any = { isActive: true };
      if (params.category) where.category = { slug: params.category };
      if (params.q) where.name = { contains: params.q, mode: 'insensitive' };

      const branchWhere: any = {};
      if (params.region) branchWhere.region = { slug: params.region };
      if (params.district) branchWhere.district = { slug: params.district };
      if (Object.keys(branchWhere).length) where.branches = { some: branchWhere };

      const [total, items] = await Promise.all([
        this.prisma.organization.count({ where }),
        this.prisma.organization.findMany({
          where,
          select: ORG_CARD_SELECT,
          orderBy: [{ ratingAvg: 'desc' }, { ratingCount: 'desc' }, { createdAt: 'desc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch (error) {
      errorResponse(error);
    }
  }

  // ---- Reviews --------------------------------------------------------------
  async addReview(dto: {
    organizationId: string;
    authorName: string;
    rating: number;
    comment?: string;
  }) {
    try {
      const org = await this.prisma.organization.findUnique({
        where: { id: dto.organizationId },
        select: { id: true },
      });
      if (!org) throw new NotFoundException('Organization not found');

      const rating = Math.min(5, Math.max(1, Math.round(dto.rating)));
      const review = await this.prisma.review.create({
        data: {
          organizationId: dto.organizationId,
          authorName: dto.authorName,
          rating,
          comment: dto.comment,
        },
      });
      await this.recomputeRating(dto.organizationId);
      return review;
    } catch (error) {
      errorResponse(error);
    }
  }

  private async recomputeRating(organizationId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { organizationId, status: 'PUBLISHED' },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        ratingAvg: Number((agg._avg.rating ?? 0).toFixed(2)),
        ratingCount: agg._count.rating ?? 0,
      },
    });
  }

  // ---- Sitemap feed (lightweight) ------------------------------------------
  async sitemapFeed() {
    try {
      const [categories, regions, districts, organizations] = await Promise.all([
        this.prisma.category.findMany({
          where: { status: 'ACTIVE' },
          select: { slug: true, updatedAt: true },
        }),
        this.prisma.region.findMany({
          where: { deletedAt: null },
          select: { slug: true, updatedAt: true },
        }),
        this.prisma.district.findMany({
          where: { deletedAt: null },
          select: { slug: true, updatedAt: true, region: { select: { slug: true } } },
        }),
        this.prisma.organization.findMany({
          where: { isActive: true, slug: { not: null } },
          select: {
            slug: true,
            updatedAt: true,
            category: { select: { slug: true } },
            branches: {
              take: 1,
              orderBy: { createdAt: 'asc' },
              select: {
                region: { select: { slug: true } },
                district: { select: { slug: true } },
              },
            },
          },
        }),
      ]);
      return { categories, regions, districts, organizations };
    } catch (error) {
      errorResponse(error);
    }
  }
  // ---- Landing Page Data (Aggregated) ---------------------------------------
  async landingData() {
    try {
      const [
        orgCount,
        catCount,
        serviceCount,
        regionCount,
        districtCount,
        branchCount,
        categories,
        featuredOrganizations,
        services,
        branches,
      ] = await Promise.all([
        this.prisma.organization.count({ where: { isActive: true } }),
        this.prisma.category.count({ where: { status: 'ACTIVE' } }),
        this.prisma.service.count(),
        this.prisma.region.count({ where: { deletedAt: null } }),
        this.prisma.district.count({ where: { deletedAt: null } }),
        this.prisma.branch.count(),
        this.prisma.category.findMany({
          where: { status: 'ACTIVE', parentId: null },
          include: {
            _count: { select: { organizations: true } },
          },
          orderBy: { sortOrder: 'asc' },
          take: 12,
        }),
        this.prisma.organization.findMany({
          where: { isActive: true },
          orderBy: [{ ratingAvg: 'desc' }, { ratingCount: 'desc' }],
          take: 6,
          include: {
            category: true,
            branches: {
              include: { region: true, district: true },
              take: 1,
            },
            gallery: { take: 3 },
            organizationServices: {
              include: { service: true },
              take: 3,
            },
          },
        }),
        this.prisma.service.findMany({
          include: { category: true },
          take: 20,
        }),
        this.prisma.branch.findMany({
          include: {
            organization: { select: { type: true } },
            region: true,
          },
        }),
      ]);

      return {
        stats: {
          organizations: orgCount,
          categories: catCount,
          services: serviceCount,
          regions: regionCount,
          districts: districtCount,
          branches: branchCount,
        },
        categories,
        featuredOrganizations,
        services,
        branches: branches.map(b => ({
          id: b.id,
          name: b.name,
          lat: b.lat,
          long: b.long,
          type: b.organization?.type,
          city: b.region?.nameUz,
          // Calculate arbitrary x, y for map visualization if needed, or pass directly
          x: `${Math.floor(Math.random() * (80 - 20) + 20)}%`,
          y: `${Math.floor(Math.random() * (80 - 20) + 20)}%`,
        })),
      };
    } catch (error) {
      errorResponse(error);
    }
  }
}
