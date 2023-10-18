import { makeOrder } from 'test/factories/make-order'
import { OnOrderCreated } from './on-order-created'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { ValidateCouponUseCase } from '../use-cases/validate-coupon'
import { FakeDateValidator } from 'test/support/fake-date-validator'
import { makeCoupon } from 'test/factories/make-coupon'
import { Coupon } from '../../enterprise/entities/coupon'

let inMemoryCouponsRepository: InMemoryCouponsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let validateCouponUseCase: ValidateCouponUseCase
let fakeDateValidator: FakeDateValidator

let couponsRepositorySave: SpyInstance<[coupon: Coupon], Promise<void>>

describe('On order created', () => {
  beforeEach(() => {
    fakeDateValidator = new FakeDateValidator()
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    validateCouponUseCase = new ValidateCouponUseCase(
      inMemoryCouponsRepository,
      fakeDateValidator,
    )

    couponsRepositorySave = vi.spyOn(inMemoryCouponsRepository, 'save')

    new OnOrderCreated(
      inMemoryOrdersRepository,
      inMemoryCouponsRepository,
      validateCouponUseCase,
    )
  })

  it('should use and decrease coupon when an order is created', async () => {
    const coupon = makeCoupon({
      quantity: 10,
    })
    const order = makeOrder({
      couponCode: coupon.code,
    })

    inMemoryCouponsRepository.create(coupon)
    inMemoryOrdersRepository.create(order)

    await waitFor(() => expect(couponsRepositorySave).toHaveBeenCalled())
    expect(inMemoryCouponsRepository.items[0].quantity).toBe(9)
  })
})
