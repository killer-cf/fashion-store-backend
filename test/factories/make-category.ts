import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Category,
  CategoryProps,
} from '@/domain/store/enterprise/entities/category'
import { faker } from '@faker-js/faker'

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      name: faker.vehicle.vehicle(),
      parentCategoryId: undefined,
      ...override,
    },
    id,
  )

  return category
}
