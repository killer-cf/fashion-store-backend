import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/store/enterprise/entities/order'
import { OrderItem } from '@/domain/store/enterprise/entities/order-item'
import {
  OrderState,
  State,
} from '@/domain/store/enterprise/entities/value-objects/order-state'
import {
  Order as PrismaOrder,
  Prisma,
  OrderItem as PrismaOrderItem,
} from '@prisma/client'

type PrismaOrderWithItems = PrismaOrder & {
  order_items: PrismaOrderItem[]
}

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrderWithItems): Order {
    const items = raw.order_items.map((item) => {
      return OrderItem.create({
        orderId: new UniqueEntityID(item.order_id),
        productId: new UniqueEntityID(item.product_id),
        quantity: item.quantity,
      })
    })

    return Order.create(
      {
        address: raw.address,
        state: new OrderState(raw.state as State),
        totalPrice: raw.totalPrice,
        trackingCode: raw.trackingCode,
        items,
        clientId: new UniqueEntityID(raw.client_id),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    const orderItems: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] =
      order.items.map((item) => {
        return {
          id: item.id.toString(),
          product_id: item.productId.toString(),
          quantity: item.quantity,
        }
      })

    return {
      id: order.id.toString(),
      address: order.address,
      trackingCode: order.trackingCode,
      totalPrice: order.totalPrice,
      client_id: order.clientId.toString(),
      state: order.state.toString(),
      order_items: {
        create: orderItems,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}