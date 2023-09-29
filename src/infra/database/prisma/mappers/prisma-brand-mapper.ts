import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Brand } from '@/domain/store/enterprise/entities/brand'
import { Brand as PrismaBrand, Prisma } from '@prisma/client'

export class PrismaBrandMapper {
  static toDomain(raw: PrismaBrand): Brand {
    return Brand.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(brand: Brand): Prisma.BrandUncheckedCreateInput {
    return {
      id: brand.id.toString(),
      name: brand.name,
    }
  }
}
