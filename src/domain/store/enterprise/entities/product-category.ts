import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ProductCategoryProps {
  productId: UniqueEntityID
  categoryId: UniqueEntityID
}

export class ProductCategory extends Entity<ProductCategoryProps> {
  get productId() {
    return this.props.productId
  }

  get categoryId() {
    return this.props.categoryId
  }

  static create(props: ProductCategoryProps, id?: UniqueEntityID) {
    const category = new ProductCategory(props, id)

    return category
  }
}
