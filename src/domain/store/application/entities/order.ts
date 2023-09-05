import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from './order-item'
import { Optional } from '@/core/types/optional'

type State =
  | 'PENDING'
  | 'APPROVED'
  | 'RECUSED'
  | 'CANCELED'
  | 'SENT'
  | 'FINISHED'

interface OrderProps {
  value: number
  clientId: UniqueEntityID
  address: string
  state: State
  items: OrderItem[]
  trackingCode?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends Entity<OrderProps> {
  get value() {
    return this.props.value
  }

  get clientId() {
    return this.props.clientId
  }

  get address() {
    return this.props.address
  }

  get state() {
    return this.props.state
  }

  set state(state: State) {
    this.props.state = state
    this.touch()
  }

  get items() {
    return this.props.items
  }

  get trackingCode() {
    return this.props.trackingCode
  }

  set trackingCode(code: string | null | undefined) {
    this.props.trackingCode = code
    this.touch()
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
    props: Optional<OrderProps, 'state' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        state: props.state ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
        ...props,
      },
      id,
    )

    return order
  }
}
