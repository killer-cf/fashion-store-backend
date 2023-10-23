import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderCreatedEvent } from '@/domain/store/enterprise/events/order-created-event'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '@/domain/store/application/repositories/orders-repository'
import { CouponsRepository } from '../repositories/coupons-repository'
import { ValidateCouponUseCase } from '../use-cases/validate-coupon'

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private couponsRepository: CouponsRepository,
    private validateCoupon: ValidateCouponUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.useCoupon.bind(this), OrderCreatedEvent.name)
  }

  private async useCoupon({ order }: OrderCreatedEvent) {
    if (order.couponCode && !order.state.isCanceled()) {
      const result = await this.validateCoupon.execute({
        value: order.subtotal,
        code: order.couponCode,
      })

      if (result.isRight()) {
        const coupon = result.value.coupon

        coupon.use()
        order.couponValue = result.value.couponDiscount

        Promise.all([
          this.couponsRepository.save(coupon),
          this.ordersRepository.save(order),
        ])
      }
    }
  }
}
