import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { CreateReviewDto } from './dto/create-review.dto';

/**
 * Public, unauthenticated read API consumed by the SEO frontend (SSR/ISR).
 * All slug-based, no ids leaked in URLs.
 */
@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Active category tree' })
  categories() {
    return this.publicService.categoryTree();
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Category by slug (+ children, services, count)' })
  categoryBySlug(@Param('slug') slug: string) {
    return this.publicService.categoryBySlug(slug);
  }

  @Get('regions')
  @ApiOperation({ summary: 'All regions with counts' })
  regions() {
    return this.publicService.regions();
  }

  @Get('regions/:slug')
  @ApiOperation({ summary: 'Region by slug (+ districts)' })
  regionBySlug(@Param('slug') slug: string) {
    return this.publicService.regionBySlug(slug);
  }

  @Get('districts/:slug')
  @ApiOperation({ summary: 'District by slug (+ region)' })
  districtBySlug(@Param('slug') slug: string) {
    return this.publicService.districtBySlug(slug);
  }

  @Get('organizations/:slug')
  @ApiOperation({ summary: 'Organization full detail by slug' })
  organizationBySlug(@Param('slug') slug: string) {
    return this.publicService.organizationBySlug(slug);
  }

  @Get('listing')
  @ApiOperation({ summary: 'Organization listing by category/region/district' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listing(
    @Query('category') category?: string,
    @Query('region') region?: string,
    @Query('district') district?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.publicService.listing({
      category,
      region,
      district,
      q,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('sitemap-feed')
  @ApiOperation({ summary: 'Lightweight slug feed for sitemap generation' })
  sitemapFeed() {
    return this.publicService.sitemapFeed();
  }

  @Get('landing')
  @ApiOperation({ summary: 'Aggregated data for the landing page' })
  landing() {
    return this.publicService.landingData();
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Add a review (recomputes rating)' })
  addReview(@Body() dto: CreateReviewDto) {
    return this.publicService.addReview(dto);
  }
}
