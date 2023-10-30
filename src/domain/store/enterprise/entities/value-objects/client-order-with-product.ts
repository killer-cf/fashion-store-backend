import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderState } from './order-state'

export type Item = {
  quantity: number
  productName: string
  productValue: number
}

export type ClientOrderWithProductProps = {
  totalPrice?: number
  subtotal: number
  clientId: UniqueEntityID
  address: string
  state: OrderState
  items: Item[]
  trackingCode?: string | null
  couponCode?: string | null
  couponValue: number
  createdAt: Date
  updatedAt?: Date | null
}

export class ClientOrderWithProduct extends ValueObject<ClientOrderWithProductProps> {
  get totalPrice() {
    return this.props.subtotal - this.props.couponValue
  }

  get subtotal() {
    return this.props.subtotal
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

  get items() {
    return this.props.items
  }

  get trackingCode() {
    return this.props.trackingCode
  }

  get couponCode() {
    return this.props.couponCode
  }

  get couponValue() {
    return this.props.couponValue
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: ClientOrderWithProductProps) {
    return new ClientOrderWithProduct(props)
  }
}
