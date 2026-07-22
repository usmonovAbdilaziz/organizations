import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma';
import { SeoEntity } from '@prisma/client';
import { CreateSeoDto } from './dto/create-seo.dto';
import { translateText } from 'src/utils/translate';

interface OrganizationSeoData {
  name: string;
  category: string;
  city?: string;
  slug: string;
}

interface CategorySeoData {
  name: string;
  slug: string;
  parentName?: string;
}

interface ServiceSeoData {
  name: string;
  slug: string;
  categoryName: string;
}

interface RegionSeoData {
  name: string;
  slug: string;
}

interface DistrictSeoData {
  name: string;
  slug: string;
  regionName: string;
}

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Translate SEO fields from Uzbek to Russian and English
   */
  private async translateSeoFields(seoData: Partial<CreateSeoDto>): Promise<Partial<CreateSeoDto>> {
    const result = { ...seoData };

    if (seoData.titleUz && !seoData.titleRu) {
      result.titleRu = await translateText(seoData.titleUz, 'ru');
    }
    if (seoData.titleUz && !seoData.titleEn) {
      result.titleEn = await translateText(seoData.titleUz, 'en');
    }

    if (seoData.descriptionUz && !seoData.descriptionRu) {
      result.descriptionRu = await translateText(seoData.descriptionUz, 'ru');
    }
    if (seoData.descriptionUz && !seoData.descriptionEn) {
      result.descriptionEn = await translateText(seoData.descriptionUz, 'en');
    }

    if (seoData.keywordsUz && !seoData.keywordsRu) {
      result.keywordsRu = await translateText(seoData.keywordsUz, 'ru');
    }
    if (seoData.keywordsUz && !seoData.keywordsEn) {
      result.keywordsEn = await translateText(seoData.keywordsUz, 'en');
    }

    if (seoData.ogTitleUz && !seoData.ogTitleRu) {
      result.ogTitleRu = await translateText(seoData.ogTitleUz, 'ru');
    }
    if (seoData.ogTitleUz && !seoData.ogTitleEn) {
      result.ogTitleEn = await translateText(seoData.ogTitleUz, 'en');
    }

    if (seoData.ogDescriptionUz && !seoData.ogDescriptionRu) {
      result.ogDescriptionRu = await translateText(seoData.ogDescriptionUz, 'ru');
    }
    if (seoData.ogDescriptionUz && !seoData.ogDescriptionEn) {
      result.ogDescriptionEn = await translateText(seoData.ogDescriptionUz, 'en');
    }

    if (seoData.twitterTitleUz && !seoData.twitterTitleRu) {
      result.twitterTitleRu = await translateText(seoData.twitterTitleUz, 'ru');
    }
    if (seoData.twitterTitleUz && !seoData.twitterTitleEn) {
      result.twitterTitleEn = await translateText(seoData.twitterTitleUz, 'en');
    }

    if (seoData.twitterDescriptionUz && !seoData.twitterDescriptionRu) {
      result.twitterDescriptionRu = await translateText(seoData.twitterDescriptionUz, 'ru');
    }
    if (seoData.twitterDescriptionUz && !seoData.twitterDescriptionEn) {
      result.twitterDescriptionEn = await translateText(seoData.twitterDescriptionUz, 'en');
    }

    return result;
  }

  /**
   * Find SEO by entity type and ID
   */
  async findSeo(entityType: SeoEntity, entityId: string) {
    return this.prisma.seo.findUnique({
      where: {
        entityType_entityId: {
          entityType,
          entityId,
        },
      },
    });
  }

  /**
   * Upsert SEO - create if doesn't exist, update if exists
   */
  async upsertSeo(
    entityType: SeoEntity,
    entityId: string,
    seoData: Partial<CreateSeoDto>,
  ) {
    const translatedSeoData = await this.translateSeoFields(seoData);

    // Remove entityType and entityId from client data as they are set by the service
    const { entityType: _, entityId: __, ...cleanSeoData } = translatedSeoData;

    const existing = await this.findSeo(entityType, entityId);

    if (existing) {
      return this.prisma.seo.update({
        where: {
          entityType_entityId: {
            entityType,
            entityId,
          },
        },
        data: cleanSeoData,
      });
    }

    return this.prisma.seo.create({
      data: {
        entityType,
        entityId,
        ...cleanSeoData,
      },
    });
  }

  /**
   * Update existing SEO
   */
  async updateSeo(
    entityType: SeoEntity,
    entityId: string,
    seoData: Partial<CreateSeoDto>,
  ) {
    const existing = await this.findSeo(entityType, entityId);
    if (!existing) {
      return null;
    }

    return this.prisma.seo.update({
      where: {
        entityType_entityId: {
          entityType,
          entityId,
        },
      },
      data: seoData,
    });
  }

  /**
   * Generate SEO for Organization
   */
  generateOrganizationSeo(data: OrganizationSeoData): Partial<CreateSeoDto> {
    const { name, category, city, slug } = data;

    const titleUz = `${name} | ${category}${city ? ` | ${city}` : ''}`;
    const titleRu = `${name} | ${category}${city ? ` | ${city}` : ''}`;
    const titleEn = `${name} | ${category}${city ? ` | ${city}` : ''}`;

    const descriptionUz = `${name} ${city || ''} hududida ${category} xizmatlarini taqdim etadi.`;
    const descriptionRu = `${name} предоставляет услуги ${category} в районе ${city || ''}.`;
    const descriptionEn = `${name} provides ${category} services in ${city || ''} area.`;

    const keywordsUz = `${name}, ${category}, ${city || ''}`.toLowerCase();
    const keywordsRu = `${name}, ${category}, ${city || ''}`.toLowerCase();
    const keywordsEn = `${name}, ${category}, ${city || ''}`.toLowerCase();

    const canonical = `/organizations/${slug}`;

    return {
      titleUz,
      titleRu,
      titleEn,
      descriptionUz,
      descriptionRu,
      descriptionEn,
      keywordsUz,
      keywordsRu,
      keywordsEn,
      canonical,
      robots: 'index,follow',
      autoGenerated: true,
    };
  }

  /**
   * Generate SEO for Category
   */
  generateCategorySeo(data: CategorySeoData): Partial<CreateSeoDto> {
    const { name, slug, parentName } = data;

    const titleUz = `Best ${name} in Uzbekistan`;
    const titleRu = `Лучшие ${name} в Узбекистане`;
    const titleEn = `Best ${name} in Uzbekistan`;

    const descriptionUz = `Find the best ${name} organizations in Uzbekistan.`;
    const descriptionRu = `Найдите лучшие организации в категории ${name} в Узбекистане.`;
    const descriptionEn = `Find the best ${name} organizations in Uzbekistan.`;

    const keywordsUz = `${name}, Uzbekistan`.toLowerCase();
    const keywordsRu = `${name}, Узбекистан`.toLowerCase();
    const keywordsEn = `${name}, Uzbekistan`.toLowerCase();

    const canonical = `/categories/${slug}`;

    return {
      titleUz,
      titleRu,
      titleEn,
      descriptionUz,
      descriptionRu,
      descriptionEn,
      keywordsUz,
      keywordsRu,
      keywordsEn,
      canonical,
      robots: 'index,follow',
      autoGenerated: true,
    };
  }

  /**
   * Generate SEO for Service
   */
  generateServiceSeo(data: ServiceSeoData): Partial<CreateSeoDto> {
    const { name, slug, categoryName } = data;

    const titleUz = `${name} Service in Uzbekistan`;
    const titleRu = `Услуга ${name} в Узбекистане`;
    const titleEn = `${name} Service in Uzbekistan`;

    const descriptionUz = `Find organizations providing ${name} service.`;
    const descriptionRu = `Найдите организации, предоставляющие услугу ${name}.`;
    const descriptionEn = `Find organizations providing ${name} service.`;

    const keywordsUz = `${name}, service`.toLowerCase();
    const keywordsRu = `${name}, услуга`.toLowerCase();
    const keywordsEn = `${name}, service`.toLowerCase();

    const canonical = `/services/${slug}`;

    return {
      titleUz,
      titleRu,
      titleEn,
      descriptionUz,
      descriptionRu,
      descriptionEn,
      keywordsUz,
      keywordsRu,
      keywordsEn,
      canonical,
      robots: 'index,follow',
      autoGenerated: true,
    };
  }

  /**
   * Generate SEO for Region
   */
  generateRegionSeo(data: RegionSeoData): Partial<CreateSeoDto> {
    const { name, slug } = data;

    const titleUz = `${name} viloyati tashkilotlari`;
    const titleRu = `Организации ${name} области`;
    const titleEn = `Organizations in ${name} region`;

    const descriptionUz = `${name} viloyatidagi barcha tashkilotlar ro'yxati. Telefonlar, manzillar, ish vaqtlari.`;
    const descriptionRu = `Список всех организаций в ${name} области. Телефоны, адреса, часы работы.`;
    const descriptionEn = `List of all organizations in ${name} region. Phones, addresses, working hours.`;

    const keywordsUz = `${name}, viloyat, tashkilotlar, katalog`.toLowerCase();
    const keywordsRu = `${name}, область, организации, каталог`.toLowerCase();
    const keywordsEn = `${name}, region, organizations, directory`.toLowerCase();

    const canonical = `/regions/${slug}`;

    return {
      titleUz,
      titleRu,
      titleEn,
      descriptionUz,
      descriptionRu,
      descriptionEn,
      keywordsUz,
      keywordsRu,
      keywordsEn,
      canonical,
      robots: 'index,follow',
      autoGenerated: true,
    };
  }

  /**
   * Generate SEO for District
   */
  generateDistrictSeo(data: DistrictSeoData): Partial<CreateSeoDto> {
    const { name, slug, regionName } = data;

    const titleUz = `Organizations in ${regionName}`;
    const titleRu = `Организации в ${regionName}`;
    const titleEn = `Organizations in ${regionName}`;

    const descriptionUz = `Browse organizations located in ${regionName}.`;
    const descriptionRu = `Просмотрите организации, расположенные в ${regionName}.`;
    const descriptionEn = `Browse organizations located in ${regionName}.`;

    const keywordsUz = `${regionName}, organizations`.toLowerCase();
    const keywordsRu = `${regionName}, организации`.toLowerCase();
    const keywordsEn = `${regionName}, organizations`.toLowerCase();

    const canonical = `/regions/${regionName}/${slug}`;

    return {
      titleUz,
      titleRu,
      titleEn,
      descriptionUz,
      descriptionRu,
      descriptionEn,
      keywordsUz,
      keywordsRu,
      keywordsEn,
      canonical,
      robots: 'index,follow',
      autoGenerated: true,
    };
  }

  /**
   * Delete SEO for an entity
   */
  async deleteSeo(entityType: SeoEntity, entityId: string) {
    return this.prisma.seo.delete({
      where: {
        entityType_entityId: {
          entityType,
          entityId,
        },
      },
    });
  }
}
