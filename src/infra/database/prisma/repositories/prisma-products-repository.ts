import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { Product } from '@/domain/store/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async findBySKU(sku: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        sku,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async listAll(page: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return products.map(PrismaProductMapper.toDomain)
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.create({
      data,
    })
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}