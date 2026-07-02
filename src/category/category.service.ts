import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma';
import { errorResponse } from 'src/utils/response';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryService: PrismaService) { }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name } = createCategoryDto

      const existsCategory = await this.categoryService.category.findFirst({ where: { name } })
      console.log(existsCategory);
      if (existsCategory) {
        throw new ConflictException("Category already exists")
      }
      const category = await this.categoryService.category.create({ data: createCategoryDto })
      return category
    } catch (error) {
      errorResponse(error)
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryService.category.findMany({ orderBy: { createdAt: "desc" } })
      return categories
    } catch (error) {
      errorResponse(error)
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryService.category.findFirst({ where: { id } })
      if (!category) {
        throw new NotFoundException("Category not found")
      }
      return category
    } catch (error) {
      errorResponse(error)
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.findOne(id)
      const newCategory = await this.categoryService.category.update({ where: { id }, data: updateCategoryDto })
      return newCategory
    } catch (error) {
      errorResponse(error)
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      const delCategory = await this.categoryService.category.delete({ where: { id } })
      return delCategory
    } catch (error) {
      errorResponse(error)
    }
  }
}
