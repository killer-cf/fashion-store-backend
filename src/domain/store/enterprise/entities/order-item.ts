import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface OrderItemProps {
  productId: UniqueEntityID
  quantity: number
}

export class OrderItem extends Entity<OrderItemProps> {
  get productId() {
    return this.props.productId
  }

  get quantity() {
    return this.props.quantity
  }

  static create(props: OrderItemProps, id?: UniqueEntityID) {
    const orderItem = new OrderItem(
      {
        ...props,
      },
      id,
    )

    return orderItem
  }
}
