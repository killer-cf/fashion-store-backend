import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ProductImage } from '@/domain/store/enterprise/entities/product-image'
import { Prisma, Image as PrismaImage } from '@prisma/client'

export class PrismaProductImageMapper {
  static toDomain(raw: PrismaImage): ProductImage {
    if (!raw.product_id) {
      throw new Error('Invalid image type')
    }

    return ProductImage.create(
      {
        imageId: new UniqueEntityID(raw.id),
        productId: new UniqueEntityID(raw.product_id),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(image: ProductImage[]): Prisma.ImageUpdateManyArgs {
    const imageIds = image.map((image) => {
      return image.imageId.toString()
    })

    return {
      where: {
        id: {
          in: imageIds,
        },
      },
      data: {
        product_id: image[0].productId.toString(),
      },
    }
  }
}
