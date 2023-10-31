import { ClientOrdersRepository } from '@/domain/store/application/repositories/client-orders-repository'
import { ClientOrder } from '@/domain/store/enterprise/entities/client-order'

export class InMemoryClientOrdersRepository implements ClientOrdersRepository {
  public items: ClientOrder[] = []

  async findManyByClientId(clientId: string): Promise<ClientOrder[]> {
    return this.items.filter((item) => item.clientId.toString() === clientId)
  }

  async create(clientOrder: ClientOrder): Promise<void> {
    this.items.push(clientOrder)
  }

  async delete(clientOrder: ClientOrder): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === clientOrder.id)

    this.items[itemIndex] = clientOrder
  }
}
