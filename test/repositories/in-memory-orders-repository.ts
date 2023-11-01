import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/store/application/repositories/orders-repository'
import { Order } from '@/domain/store/enterprise/entities/order'
import {
  ClientOrderWithProduct,
  Item,
} from '@/domain/store/enterprise/entities/value-objects/client-order-with-product'
import { InMemoryProductsRepository } from './in-memory-products-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(private productsRepository: InMemoryProductsRepository) {}

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((order) => order.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByClientIdWithProduct(
    clientId: string,
    { page }: PaginationParams,
  ): Promise<ClientOrderWithProduct[]> {
    const clientOrders = this.items
      .filter((item) => item.clientId.toString() === clientId)
      .slice((page - 1) * 20, page * 20)

    const clientOrdersWithProduct = clientOrders.map((order) => {
      const items: Item[] = order.items.map((item) => {
        const product = this.productsRepository.items.find(
          (p) => p.id.toString() === item.productId.toString(),
        )

        if (!product) {
          throw new Error('Product not found')
        }

        return {
          quantity: item.quantity,
          productName: product.name,
          productValue: product.price,
        }
      })

      return ClientOrderWithProduct.create({
        address: order.address,
        subtotal: order.subtotal,
        state: order.state,
        trackingCode: order.trackingCode,
        totalPrice: order.totalPrice,
        clientId: order.clientId,
        couponValue: order.couponValue,
        couponCode: order.couponCode,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items,
      })
    })

    return clientOrdersWithProduct
  }

  async findManyByClientId(clientId: string): Promise<Order[]> {
    const clientOrders = this.items.filter(
      (item) => item.clientId.toString() === clientId,
    )

    return clientOrders
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async save(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[orderIndex] = order
  }
}
