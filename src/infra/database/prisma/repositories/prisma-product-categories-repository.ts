import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ProductCategoriesRepository } from '@/domain/store/application/repositories/product-categories-repository'
import { ProductCategory } from '@/domain/store/enterprise/entities/product-category'
import { PrismaProductCategoryMapper } from '../mappers/prisma-product-category-mapper'

@Injectable()
export class PrismaProductCategoriesRepository
  implements ProductCategoriesRepository
{
  constructor(private prisma: PrismaService) {}
  async createMany(productCategories: ProductCategory[]): Promise<void> {
    if (productCategories.length === 0) {
      return
    }

    const data =
      PrismaProductCategoryMapper.toPrismaCreateMany(productCategories)

    await this.prisma.productCategories.createMany({
      data,
    })
  }

  async deleteMany(productCategories: ProductCategory[]): Promise<void> {
    if (productCategories.length === 0) {
      return
    }

    const productIds = productCategories.map((productCategory) => {
      return productCategory.productId.toString()
    })

    const categoriesIds = productCategories.map((productCategory) => {
      return productCategory.categoryId.toString()
    })

    await this.prisma.productCategories.deleteMany({
      where: {
        productId: {
          in: productIds,
        },
        categoryId: {
          in: categoriesIds,
        },
      },
    })
  }

  async findManyByProductId(productId: string): Promise<ProductCategory[]> {
    const productCategories = await this.prisma.productCategories.findMany({
      where: {
        productId,
      },
    })

    return productCategories.map(PrismaProductCategoryMapper.toDomain)
  }

  async deleteManyByProductId(productId: string): Promise<void> {
    await this.prisma.productCategories.deleteMany({
      where: {
        productId,
      },
    })
  }
}
