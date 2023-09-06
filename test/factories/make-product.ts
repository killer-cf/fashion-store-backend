import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Product,
  ProductProps,
} from '@/domain/store/enterprise/entities/product'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      name: faker.vehicle.vehicle(),
      brand: faker.company.name(),
      color: faker.color.human(),
      model: faker.vehicle.manufacturer(),
      price: faker.number.int(1000),
      sku: randomUUID(),
      ...override,
    },
    id,
  )

  return product
}
