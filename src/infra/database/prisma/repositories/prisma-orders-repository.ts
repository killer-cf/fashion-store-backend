import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/store/enterprise/entities/order'
import { OrdersRepository } from '@/domain/store/application/repositories/orders-repository'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ClientOrderWithProduct } from '@/domain/store/enterprise/entities/value-objects/client-order-with-product'
import { PrismaClientOrderWithProductMapper } from '../mappers/prisma-client-order-with-product-mapper'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        order_items: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async listAll(page: number): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { order_items: true },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyByClientIdWithProduct(
    clientId: string,
    { page }: PaginationParams,
  ): Promise<ClientOrderWithProduct[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        client_id: clientId,
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaClientOrderWithProductMapper.toDomain)
  }

  async findManyByClientId(clientId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        client_id: clientId,
      },
      include: {
        order_items: true,
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async save(order: Order): Promise<void> {
    const { id, ...data } = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id,
      },
      data,
    })
  }
}
