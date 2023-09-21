import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface OrderItemProps {
  orderId: UniqueEntityID
  productId: UniqueEntityID
  quantity: number
}

export class OrderItem extends Entity<OrderItemProps> {
  get orderId() {
    return this.props.orderId
  }

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
