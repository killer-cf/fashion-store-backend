import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductCategory } from '@/domain/store/enterprise/entities/product-category'
import {
  Prisma,
  ProductCategories as PrismaProductCategory,
} from '@prisma/client'

export class PrismaProductCategoryMapper {
  static toDomain(raw: PrismaProductCategory): ProductCategory {
    return ProductCategory.create(
      {
        productId: new UniqueEntityID(raw.productId),
        categoryId: new UniqueEntityID(raw.categoryId),
      },
      new UniqueEntityID(),
    )
  }

  static toPrismaCreateMany(
    productCategories: ProductCategory[],
  ): Prisma.ProductCategoriesCreateManyInput[] {
    return productCategories.map((pc) => {
      return {
        productId: pc.productId.toString(),
        categoryId: pc.categoryId.toString(),
      }
    })
  }
}
