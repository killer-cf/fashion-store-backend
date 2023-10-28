import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductDetails } from '@/domain/store/enterprise/entities/value-objects/product-details'
import { ProductStatus } from '@/domain/store/enterprise/entities/value-objects/product-status'
import {
  Product as PrismaProduct,
  Brand,
  Image,
  ProductCategories,
  Category,
} from '@prisma/client'
import { PrismaImageMapper } from './prisma-image-mapper'
import { PrismaCategoryMapper } from './prisma-category-mapper'

type ProductCategoriesWithCategory = ProductCategories & {
  category: Category
}

type PrismaProductDetails = PrismaProduct & {
  brand: Brand
  images: Image[]
  product_categories: ProductCategoriesWithCategory[]
}

export class PrismaProductDetailsMapper {
  static toDomain(raw: PrismaProductDetails): ProductDetails {
    return ProductDetails.create({
      productId: new UniqueEntityID(raw.id),
      name: raw.name,
      sku: raw.sku,
      status: ProductStatus.create(raw.status),
      model: raw.model,
      colors: raw.colors,
      description: raw.description,
      price: raw.price,
      brandId: new UniqueEntityID(raw.brand_id),
      brandName: raw.brand.name,
      images: raw.images.map(PrismaImageMapper.toDomain),
      categories: raw.product_categories.map((pc) =>
        PrismaCategoryMapper.toDomain(pc.category),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
