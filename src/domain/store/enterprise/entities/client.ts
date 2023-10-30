import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClientOrder } from './client-order'

export interface ClientProps {
  name: string
  email: string
  password: string
  phone: string
  orders?: ClientOrder[]
}

export class Client extends Entity<ClientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get phone() {
    return this.props.phone
  }

  set phone(number: string) {
    this.props.phone = number
  }

  get orders() {
    return this.props.orders
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id)

    return client
  }
}
