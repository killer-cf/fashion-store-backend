import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ProductImageList } from './product-image-list'
import { ProductStatus, Status } from './value-objects/product-status'
import { ProductCategoryList } from './product-category-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface ProductProps {
  name: string
  description: string
  price: number
  sku: string
  model: string
  colors: string[]
  categories: ProductCategoryList
  status: ProductStatus
  images: ProductImageList
  brandId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends AggregateRoot<ProductProps> {
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

  get categories() {
    return this.props.categories
  }

  set categories(categories: ProductCategoryList) {
    this.props.categories = categories
    this.touch()
  }

  get status() {
    return this.props.status
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ProductProps, 'createdAt' | 'images' | 'categories'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        images: props.images ?? new ProductImageList(),
        categories: props.categories ?? new ProductCategoryList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}
