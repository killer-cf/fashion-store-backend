import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { SubCategoriesRepository } from '@/domain/store/application/repositories/sub-categories-repository'
import { SubCategory } from '@/domain/store/enterprise/entities/sub-category'
import { PrismaSubCategoryMapper } from '../mappers/prisma-sub-category-mapper'

@Injectable()
export class PrismaSubCategoriesRepository implements SubCategoriesRepository {
  constructor(private prisma: PrismaService) {}
  async createMany(subcategory: SubCategory[]): Promise<void> {
    if (subcategory.length === 0) {
      return
    }

    const data = PrismaSubCategoryMapper.toPrismaUpdateMany(subcategory)

    await this.prisma.category.updateMany(data)
  }

  async deleteMany(subcategory: SubCategory[]): Promise<void> {
    if (subcategory.length === 0) {
      return
    }

    const subcategoryIds = subcategory.map((image) => {
      return image.id.toString()
    })

    await this.prisma.category.deleteMany({
      where: {
        id: {
          in: subcategoryIds,
        },
      },
    })
  }

  async findManyByCategoryId(categoryId: string): Promise<SubCategory[]> {
    const subCategories = await this.prisma.category.findMany({
      where: {
        parentCategoryId: categoryId,
      },
    })

    return subCategories.map(PrismaSubCategoryMapper.toDomain)
  }

  async deleteManyByCategoryId(categoryId: string): Promise<void> {
    await this.prisma.category.deleteMany({
      where: {
        parentCategoryId: categoryId,
      },
    })
  }
}
