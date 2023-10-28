import { CategoriesRepository } from '@/domain/store/application/repositories/categories-repository'
import { Category } from '@/domain/store/enterprise/entities/category'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findMany(page: number): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return categories.map(PrismaCategoryMapper.toDomain)
  }

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.create({
      data,
    })
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.delete({
      where: {
        id: data.id,
      },
    })
  }
}
