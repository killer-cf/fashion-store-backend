import { ProductImage } from '../../enterprise/entities/product-image'

export abstract class ProductImagesRepository {
  abstract createMany(images: ProductImage[]): Promise<void>
  abstract deleteMany(images: ProductImage[]): Promise<void>

  abstract findManyByProductId(productId: string): Promise<ProductImage[]>

  abstract deleteManyByProductId(productId: string): Promise<void>
}
