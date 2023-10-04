import { Brand } from '@/domain/store/enterprise/entities/brand'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { BrandsRepository } from '@/domain/store/application/repositories/brands-repository'
import { PrismaBrandMapper } from '../mappers/prisma-brand-mapper'

@Injectable()
export class PrismaBrandsRepository implements BrandsRepository {
  constructor(private prisma: PrismaService) {}
  async findByName(name: string): Promise<Brand | null> {
    const brand = await this.prisma.brand.findUnique({
      where: {
        name,
      },
    })

    if (!brand) {
      return null
    }

    return PrismaBrandMapper.toDomain(brand)
  }

  async listAll(page: number): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return brands.map(PrismaBrandMapper.toDomain)
  }

  async create(brand: Brand): Promise<void> {
    const data = PrismaBrandMapper.toPrisma(brand)

    await this.prisma.brand.create({
      data,
    })
  }
}
