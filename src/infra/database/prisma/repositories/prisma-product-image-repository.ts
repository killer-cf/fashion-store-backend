import { ProductImagesRepository } from '@/domain/store/application/repositories/product-images-repository'
import { ProductImage } from '@/domain/store/enterprise/entities/product-image'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductImageMapper } from '../mappers/prisma-product-image-mapper'

@Injectable()
export class PrismaProductImagesRepository implements ProductImagesRepository {
  constructor(private prisma: PrismaService) {}
  async createMany(images: ProductImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const data = PrismaProductImageMapper.toPrismaUpdateMany(images)

    await this.prisma.image.updateMany(data)
  }

  async deleteMany(images: ProductImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const imagesIds = images.map((image) => {
      return image.id.toString()
    })

    await this.prisma.image.deleteMany({
      where: {
        id: {
          in: imagesIds,
        },
      },
    })
  }

  async findManyByProductId(productId: string): Promise<ProductImage[]> {
    const productImages = await this.prisma.image.findMany({
      where: {
        product_id: productId,
      },
    })

    return productImages.map(PrismaProductImageMapper.toDomain)
  }

  async deleteManyByProductId(productId: string): Promise<void> {
    await this.prisma.image.deleteMany({
      where: {
        product_id: productId,
      },
    })
  }
}
