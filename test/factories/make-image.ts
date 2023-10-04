import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image, ImageProps } from '@/domain/store/enterprise/entities/image'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaImageMapper } from '@/infra/database/prisma/mappers/prisma-image-mapper'

export function makeImage(
  override: Partial<ImageProps> = {},
  id?: UniqueEntityID,
) {
  const image = Image.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return image
}

@Injectable()
export class ImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaImage(data: Partial<ImageProps> = {}): Promise<Image> {
    const image = makeImage(data)

    await this.prisma.image.create({
      data: PrismaImageMapper.toPrisma(image),
    })

    return image
  }
}
