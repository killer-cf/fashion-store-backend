import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { Product } from '@/domain/store/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { ProductImagesRepository } from '@/domain/store/application/repositories/product-images-repository'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(
    private prisma: PrismaService,
    private productImagesRepository: ProductImagesRepository,
  ) {}

  async findBySKU(sku: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        sku,
      },
      include: {
        brand: true,
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
      include: {
        brand: true,
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
      include: {
        brand: true,
      },
    })

    return products.map(PrismaProductMapper.toDomain)
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.create({
      data,
    })

    await this.productImagesRepository.createMany(product.images.getItems())
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    Promise.all([
      this.prisma.product.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.productImagesRepository.createMany(product.images.getNewItems()),
      this.productImagesRepository.deleteMany(product.images.getRemovedItems()),
    ])
  }
}
