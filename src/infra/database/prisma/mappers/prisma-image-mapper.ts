import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image } from '@/domain/store/enterprise/entities/image'
import { Prisma, Image as PrismaImage } from '@prisma/client'

export class PrismaImageMapper {
  static toDomain(raw: PrismaImage): Image {
    return Image.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(image: Image): Prisma.ImageUncheckedCreateInput {
    return {
      id: image.id.toString(),
      title: image.title,
      url: image.url,
    }
  }
}
