import { ValueObject } from '@/core/entities/value-object'
import { ProductProps } from '../product'

export type ProductWithDetailsProps = ProductProps & {
  brandId: string
  brandName: string
}

export class ProductWithDetails extends ValueObject<ProductWithDetailsProps> {
  get name() {
    return this.props.name
  }

  get price() {
    return this.props.price
  }

  get quantity() {
    return this.props.quantity
  }

  get sku() {
    return this.props.sku
  }

  get model() {
    return this.props.model
  }

  get color() {
    return this.props.color
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get brandId() {
    return this.props.brandId
  }

  get brandName() {
    return this.props.brandName
  }

  static create(props: ProductWithDetailsProps) {
    return new ProductWithDetails(props)
  }
}
