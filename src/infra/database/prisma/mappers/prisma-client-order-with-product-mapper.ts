import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderItem as PrismaOrderItem,
  Order as PrismaOrder,
  Product,
} from '@prisma/client'
import { ClientOrderWithProduct } from '@/domain/store/enterprise/entities/value-objects/client-order-with-product'
import {
  OrderState,
  State,
} from '@/domain/store/enterprise/entities/value-objects/order-state'

type PrismaOrderItemWithProduct = PrismaOrderItem & {
  product: Product
}

type PrismaClientOrderWithProduct = PrismaOrder & {
  order_items: PrismaOrderItemWithProduct[]
}

export class PrismaClientOrderWithProductMapper {
  static toDomain(raw: PrismaClientOrderWithProduct): ClientOrderWithProduct {
    return ClientOrderWithProduct.create({
      address: raw.address,
      couponValue: raw.couponValue,
      clientId: new UniqueEntityID(raw.client_id),
      state: new OrderState(raw.state as State),
      subtotal: raw.subtotal,
      couponCode: raw.couponCode,
      trackingCode: raw.trackingCode,
      totalPrice: raw.totalPrice,
      items: raw.order_items.map((item) => {
        return {
          productName: item.product.name,
          quantity: item.quantity,
          productValue: item.product.price,
        }
      }),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
