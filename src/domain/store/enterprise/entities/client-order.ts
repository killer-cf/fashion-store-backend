import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClientOrderProps {
  clientId: UniqueEntityID
  orderId: UniqueEntityID
}

export class ClientOrder extends Entity<ClientOrderProps> {
  get clientId() {
    return this.props.clientId
  }

  get orderId() {
    return this.props.orderId
  }

  static create(props: ClientOrderProps, id?: UniqueEntityID) {
    const clientOrder = new ClientOrder(props, id)

    return clientOrder
  }
}
