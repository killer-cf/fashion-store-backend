import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface ProductProps {
  name: string
  quantity: number
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
        name: props.name,
        quantity: props.quantity ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}
