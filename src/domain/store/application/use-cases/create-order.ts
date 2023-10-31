import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '../../enterprise/entities/order-item'
import { ProductsRepository } from '../repositories/products-repository'
import { Product } from '../../enterprise/entities/product'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface CreateOrderUseCaseRequest {
  clientId: string
  address: string
  couponCode?: string
  deliveryFee: number
  items: {
    productId: string
    quantity: number
  }[]
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

type ProductItem = {
  product: Product
  quantity: number
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    clientId,
    address,
    couponCode,
    deliveryFee,
    items,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const verifiedProducts: ProductItem[] = []

    const productInfos = await Promise.all(
      items.map(async (item) => {
        const product = await this.productsRepository.findById(item.productId)
        return product
          ? verifiedProducts.push({ product, quantity: item.quantity })
          : null
      }),
    )

    const allProductsAreValid = productInfos.every((info) => info !== null)

    if (!allProductsAreValid) {
      return left(new ResourceNotFoundError())
    }

    const totalOfProductItems = verifiedProducts.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)

    const clientOrders =
      await this.ordersRepository.findManyByClientId(clientId)

    const isFirstOrder = clientOrders.length === 0

    const order = Order.create({
      address,
      couponCode,
      deliveryFee,
      isFirstOrder,
      clientId: new UniqueEntityID(clientId),
      subtotal: totalOfProductItems,
      items: [],
    })

    const orderItems = items.map((item) => {
      return OrderItem.create({
        orderId: order.id,
        productId: new UniqueEntityID(item.productId),
        quantity: item.quantity,
      })
    })

    order.items = orderItems

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
