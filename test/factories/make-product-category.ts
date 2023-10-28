import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ProductCategory,
  ProductCategoryProps,
} from '@/domain/store/enterprise/entities/product-category'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeProductCategory(
  override: Partial<ProductCategoryProps> = {},
  id?: UniqueEntityID,
) {
  const productCategory = ProductCategory.create(
    {
      productId: new UniqueEntityID(),
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return productCategory
}

@Injectable()
export class ProductCategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProductCategory(
    data: Partial<ProductCategoryProps> = {},
  ): Promise<ProductCategory> {
    const productCategory = makeProductCategory(data)

    await this.prisma.productCategories.create({
      data: {
        productId: productCategory.productId.toString(),
        categoryId: productCategory.categoryId.toString(),
      },
    })

    return productCategory
  }
}
