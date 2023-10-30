import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ClientOrderWithProduct } from '../../enterprise/entities/value-objects/client-order-with-product'
import { OrdersRepository } from '../repositories/orders-repository'

interface ListClientOrdersUseCaseRequest {
  clientId: string
  page: number
}

type ListClientOrdersUseCaseResponse = Either<
  null,
  {
    clientOrders: ClientOrderWithProduct[]
  }
>

@Injectable()
export class ListClientOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    clientId,
    page,
  }: ListClientOrdersUseCaseRequest): Promise<ListClientOrdersUseCaseResponse> {
    const clientOrders =
      await this.ordersRepository.findManyByClientIdWithProduct(clientId, {
        page,
      })

    return right({ clientOrders })
  }
}
