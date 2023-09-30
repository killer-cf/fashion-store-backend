import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Brand, BrandProps } from '@/domain/store/enterprise/entities/brand'
import { PrismaBrandMapper } from '@/infra/database/prisma/mappers/prisma-brand-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeBrand(
  override: Partial<BrandProps> = {},
  id?: UniqueEntityID,
) {
  const brand = Brand.create(
    {
      name: faker.vehicle.vehicle(),
      ...override,
    },
    id,
  )

  return brand
}

@Injectable()
export class BrandFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBrand(data: Partial<BrandProps> = {}): Promise<Brand> {
    const brand = makeBrand(data)

    await this.prisma.brand.create({
      data: PrismaBrandMapper.toPrisma(brand),
    })

    return brand
  }
}
