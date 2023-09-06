import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface ProductProps {
  name: string
  quantity: number
  sku: string
  brand: string
  model: string
  color: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name
  }

  get quantity() {
    return this.props.quantity
  }

  get sku() {
    return this.props.sku
  }

  get brand() {
    return this.props.brand
  }

  get model() {
    return this.props.model
  }

  get color() {
    return this.props.color
  }

  increaseStock(quantity: number) {
    this.props.quantity += quantity
  }

  decreaseStock(quantity: number) {
    this.props.quantity -= quantity
  }

  static create(
    props: Optional<ProductProps, 'quantity' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        quantity: props.quantity ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}
