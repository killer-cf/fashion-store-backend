import { ImagesRepository } from '@/domain/store/application/repositories/images-repository'
import { Image } from '@/domain/store/enterprise/entities/image'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaImageMapper } from '../mappers/prisma-image-mapper'

@Injectable()
export class PrismaImagesRepository implements ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(image: Image): Promise<void> {
    const data = PrismaImageMapper.toPrisma(image)

    await this.prisma.image.create({
      data,
    })
  }
}
