import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Brand } from '@/domain/store/enterprise/entities/brand'
import { Product } from '@/domain/store/enterprise/entities/product'
import {
  Prisma,
  Product as PrismaProduct,
  Brand as PrismaBrand,
} from '@prisma/client'

type PrismaProductWithBrand = PrismaProduct & {
  brand: PrismaBrand
}
export class PrismaProductMapper {
  static toDomain(raw: PrismaProductWithBrand): Product {
    return Product.create(
      {
        name: raw.name,
        sku: raw.sku,
        brand: Brand.create(
          { name: raw.brand.name },
          new UniqueEntityID(raw.brand.id),
        ),
        model: raw.model,
        color: raw.color,
        price: raw.price,
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
      brand_id: product.brand.id.toString(),
      color: product.color,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
