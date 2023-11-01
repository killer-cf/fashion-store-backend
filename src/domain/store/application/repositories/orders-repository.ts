import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import { ClientOrderWithProduct } from '../../enterprise/entities/value-objects/client-order-with-product'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyByClientIdWithProduct(
    clientId: string,
    params: PaginationParams,
  ): Promise<ClientOrderWithProduct[]>

  abstract findManyByClientId(clientId: string): Promise<Order[]>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
}
