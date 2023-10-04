import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ProductImage,
  ProductImageProps,
} from '@/domain/store/enterprise/entities/product-image'
import { PrismaProductImageMapper } from '@/infra/database/prisma/mappers/prisma-product-image-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeProductImage(
  override: Partial<ProductImageProps> = {},
  id?: UniqueEntityID,
) {
  const productImage = ProductImage.create(
    {
      productId: new UniqueEntityID(),
      imageId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return productImage
}

@Injectable()
export class ProductImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProductImage(
    data: Partial<ProductImageProps> = {},
  ): Promise<ProductImage> {
    const productImage = makeProductImage(data)

    await this.prisma.image.update({
      where: {
        id: productImage.imageId.toString(),
      },
      data: {
        product_id: productImage.productId.toString(),
      },
    })

    return productImage
  }
}
