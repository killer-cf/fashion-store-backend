import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderCreatedEvent } from '@/domain/store/enterprise/events/order-created-event'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '@/domain/store/application/repositories/orders-repository'
import { CouponsRepository } from '../repositories/coupons-repository'

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private couponsRepository: CouponsRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.useCoupon.bind(this), OrderCreatedEvent.name)
  }

  private async useCoupon({ order }: OrderCreatedEvent) {
    if (order.couponCode && !order.state.isCanceled()) {
      const coupon = await this.couponsRepository.findByCode(order.couponCode)

      if (coupon) {
        coupon.use()
        order.couponValue = coupon.finalDiscount(order.subtotal)

        if (coupon.isFreeShipping) {
          order.couponValue = 0
          order.deliveryFee = 0
        }

        Promise.all([
          this.couponsRepository.save(coupon),
          this.ordersRepository.save(order),
        ])
      }
    }
  }
}
