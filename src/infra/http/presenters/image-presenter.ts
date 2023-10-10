import { Image } from '@/domain/store/enterprise/entities/image'

export class ImagePresenter {
  static toHTTP(image: Image) {
    return {
      id: image.id.toString(),
      title: image.title,
      url: image.url,
    }
  }
}
