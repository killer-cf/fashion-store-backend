import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/store/enterprise/entities/product'
import { Prisma, Product as PrismaProduct } from '@prisma/client'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        name: raw.name,
        sku: raw.sku,
        model: raw.model,
        color: raw.color,
        price: raw.price,
        brandId: new UniqueEntityID(raw.brand_id),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      sku: product.sku,
      model: product.model,
      brand_id: product.brandId.toString(),
      color: product.color,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
