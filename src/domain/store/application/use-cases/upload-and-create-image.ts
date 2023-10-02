import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidImageType } from './errors/invalid-image-type'
import { Image } from '../../enterprise/entities/image'
import { ImagesRepository } from '../repositories/images-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateImageUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateImageUseCaseResponse = Either<
  InvalidImageType,
  {
    image: Image
  }
>
@Injectable()
export class UploadAndCreateImageUseCase {
  constructor(
    private imagesRepository: ImagesRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateImageUseCaseRequest): Promise<UploadAndCreateImageUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$/.test(fileType)) {
      return left(new InvalidImageType(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const image = Image.create({
      title: fileName,
      url,
    })

    await this.imagesRepository.create(image)

    return right({ image })
  }
}
