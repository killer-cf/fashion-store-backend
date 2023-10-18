import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from './order-item'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { OrderState, State } from './value-objects/order-state'
import { OrderCreatedEvent } from '../events/order-created-event'

export interface OrderProps {
  totalPrice: number
  clientId: UniqueEntityID
  address: string
  state: OrderState
  items: OrderItem[]
  trackingCode?: string | null
  couponCode?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get totalPrice() {
    return this.props.totalPrice
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

  set state(state: OrderState) {
    this.props.state = state
    this.touch()
  }

  get items() {
    return this.props.items
  }

  set items(items: OrderItem[]) {
    this.props.items = items
  }

  get trackingCode() {
    return this.props.trackingCode
  }

  set trackingCode(code: string | null | undefined) {
    this.props.trackingCode = code
    this.touch()
  }

  get couponCode() {
    return this.props.couponCode
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  approve() {
    this.state = new OrderState(State.APPROVED)
  }

  cancel() {
    this.state = new OrderState(State.CANCELED)
  }

  refuse() {
    this.state = new OrderState(State.RECUSED)
  }

  send() {
    this.state = new OrderState(State.SENT)
  }

  finish() {
    this.state = new OrderState(State.FINISHED)
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
        state: props.state ?? new OrderState(State.PENDING),
        createdAt: props.createdAt ?? new Date(),
        ...props,
      },
      id,
    )

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreatedEvent(order))
    }

    return order
  }
}
