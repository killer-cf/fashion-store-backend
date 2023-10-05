import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ProductImageList } from './product-image-list'

export interface ProductProps {
  name: string
  description: string
  price: number
  sku: string
  model: string
  colors: string[]
  images: ProductImageList
  brandId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get price() {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
    this.touch()
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

  set colors(colors: string[]) {
    this.props.colors = colors
    this.touch()
  }

  get images() {
    return this.props.images
  }

  set images(images: ProductImageList) {
    this.props.images = images
    this.touch()
  }

  get brandId() {
    return this.props.brandId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ProductProps, 'createdAt' | 'images'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        images: props.images ?? new ProductImageList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}
