import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/store/enterprise/entities/category'
import { Category as PrismaCategory, Prisma } from '@prisma/client'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
    }
  }
}
