import { ImagesRepository } from '@/domain/store/application/repositories/images-repository'
import { Image } from '@/domain/store/enterprise/entities/image'

export class InMemoryImagesRepository implements ImagesRepository {
  public items: Image[] = []

  async create(image: Image): Promise<void> {
    this.items.push(image)
  }
}
