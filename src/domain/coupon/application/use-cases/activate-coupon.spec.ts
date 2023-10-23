import { ActivateCouponUseCase } from './activate-coupon'
import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { makeCoupon } from 'test/factories/make-coupon'
import { CouponStatus } from '../../enterprise/entities/value-objects/coupon-status'

describe('Activate coupon', () => {
  let inMemoryCouponsRepository: InMemoryCouponsRepository
  let sut: ActivateCouponUseCase

  beforeEach(() => {
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    sut = new ActivateCouponUseCase(inMemoryCouponsRepository)
  })

  it('should be able to activate coupon', async () => {
    const coupon = makeCoupon({
      status: CouponStatus.create('DISABLED'),
    })

    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      couponCode: coupon.code,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCouponsRepository.items[0].isActive()).toBeTruthy()
    }
  })
})
