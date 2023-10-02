import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ProductImageProps {
  productId: UniqueEntityID
  imageId: UniqueEntityID
}

export class ProductImage extends Entity<ProductImageProps> {
  get productId() {
    return this.props.productId
  }

  get imageId() {
    return this.props.imageId
  }

  static create(props: ProductImageProps, id?: UniqueEntityID) {
    const productImage = new ProductImage(props, id)

    return productImage
  }
}
