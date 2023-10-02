import { ProductImagesRepository } from '@/domain/store/application/repositories/product-images-repository'
import { ProductImage } from '@/domain/store/enterprise/entities/product-image'

export class InMemoryProductImagesRepository
  implements ProductImagesRepository
{
  public items: ProductImage[] = []

  async findManyByProductId(productId: string): Promise<ProductImage[]> {
    const productImages = this.items.filter(
      (item) => item.productId.toString() === productId,
    )

    return productImages
  }

  async deleteManyByProductId(productId: string): Promise<void> {
    const productImages = this.items.filter(
      (item) => item.productId.toString() !== productId,
    )

    this.items = productImages
  }

  async createMany(images: ProductImage[]): Promise<void> {
    this.items.push(...images)
  }

  async deleteMany(images: ProductImage[]): Promise<void> {
    const productImages = this.items.filter((item) => {
      return !images.some((image) => image.equals(item))
    })

    this.items = productImages
  }
}
