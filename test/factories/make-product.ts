import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Product,
  ProductProps,
} from '@/domain/store/enterprise/entities/product'
import { ProductCategoryList } from '@/domain/store/enterprise/entities/product-category-list'
import { ProductImageList } from '@/domain/store/enterprise/entities/product-image-list'
import { ProductStatus } from '@/domain/store/enterprise/entities/value-objects/product-status'
import { PrismaProductMapper } from '@/infra/database/prisma/mappers/prisma-product-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      name: faker.vehicle.vehicle(),
      brandId: new UniqueEntityID(),
      colors: Array.from(faker.color.human()),
      status: ProductStatus.create('ACTIVE'),
      description: faker.lorem.paragraph(),
      model: faker.vehicle.manufacturer(),
      price: faker.number.int(1000),
      sku: randomUUID(),
      images: new ProductImageList(),
      categories: new ProductCategoryList(),
      ...override,
    },
    id,
  )

  return product
}

@Injectable()
export class ProductFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data)

    await this.prisma.product.create({
      data: PrismaProductMapper.toPrisma(product),
    })

    return product
  }
}
