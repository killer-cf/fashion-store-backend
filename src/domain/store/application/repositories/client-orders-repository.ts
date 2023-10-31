import { PaginationParams } from '@/core/repositories/pagination-params'
import { ClientOrder } from '../../enterprise/entities/client-order'

export abstract class ClientOrdersRepository {
  abstract findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<ClientOrder[]>

  abstract create(clientOrder: ClientOrder): Promise<void>
  abstract delete(clientOrder: ClientOrder): Promise<void>
}
