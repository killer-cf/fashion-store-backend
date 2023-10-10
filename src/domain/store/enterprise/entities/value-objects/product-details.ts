import { ValueObject } from '@/core/entities/value-object'
import { Image } from '../image'
import { ProductStatus, Status } from './product-status'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type ProductDetailsProps = {
  productId: UniqueEntityID
  brandId: UniqueEntityID
  brandName: string
  name: string
  description: string
  price: number
  sku: string
  model: string
  colors: string[]
  images: Image[]
  status: ProductStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class ProductDetails extends ValueObject<ProductDetailsProps> {
  get productId() {
    return this.props.productId
  }

  get name() {
    return this.props.name
  }

  get price() {
    return this.props.price
  }

  get sku() {
    return this.props.sku
  }

  get model() {
    return this.props.model
  }

  get colors() {
    return this.props.colors
  }

  get status() {
    return this.props.status
  }

  get description() {
    return this.props.description
  }

  get brandId() {
    return this.props.brandId
  }

  get brandName() {
    return this.props.brandName
  }

  get images() {
    return this.props.images
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public activate() {
    this.props.status = new ProductStatus(Status.ACTIVE)
  }

  public disable() {
    this.props.status = new ProductStatus(Status.DISABLED)
  }

  public isActive(): boolean {
    return this.props.status.getValue() === Status.ACTIVE
  }

  public isDisabled(): boolean {
    return this.props.status.getValue() === Status.DISABLED
  }

  static create(props: ProductDetailsProps) {
    return new ProductDetails(props)
  }
}
