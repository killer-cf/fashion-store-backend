import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ProductImage,
  ProductImageProps,
} from '@/domain/store/enterprise/entities/product-image'

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
