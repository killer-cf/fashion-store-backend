import { ProductsRepository } from '@/domain/store/application/repositories/products-repository'
import { Product } from '@/domain/store/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { ProductImagesRepository } from '@/domain/store/application/repositories/product-images-repository'
import { ProductDetails } from '@/domain/store/enterprise/entities/value-objects/product-details'
import { PrismaProductDetailsMapper } from '../mappers/prisma-product-details-mapper'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { ProductCategoriesRepository } from '@/domain/store/application/repositories/product-categories-repository'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private productImagesRepository: ProductImagesRepository,
    private productCategoriesRepository: ProductCategoriesRepository,
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

  async findDetailsById(id: string): Promise<ProductDetails | null> {
    const cacheHit = await this.cache.get(`product:${id}:details`)

    if (cacheHit) {
      return JSON.parse(cacheHit)
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        brand: true,
        images: true,
      },
    })

    if (!product) {
      return null
    }

    const productDetails = PrismaProductDetailsMapper.toDomain(product)

    await this.cache.set(
      `product:${id}:details`,
      JSON.stringify(productDetails),
    )

    return productDetails
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

  async listAllActive(page: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        status: 'ACTIVE',
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

    Promise.all([
      this.productImagesRepository.createMany(product.images.getItems()),
      this.productCategoriesRepository.createMany(
        product.categories.getItems(),
      ),
    ])
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
      this.productCategoriesRepository.createMany(
        product.categories.getNewItems(),
      ),
      this.productCategoriesRepository.deleteMany(
        product.categories.getRemovedItems(),
      ),
      this.cache.delete(`product:${product.id.toString()}:details`),
    ])
  }
}
