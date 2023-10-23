import { DisableCouponUseCase } from './disable-coupon'
import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { makeCoupon } from 'test/factories/make-coupon'
import { CouponStatus } from '../../enterprise/entities/value-objects/coupon-status'

describe('Disable coupon', () => {
  let inMemoryCouponsRepository: InMemoryCouponsRepository
  let sut: DisableCouponUseCase

  beforeEach(() => {
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    sut = new DisableCouponUseCase(inMemoryCouponsRepository)
  })

  it('should be able to disable coupon', async () => {
    const coupon = makeCoupon({
      status: CouponStatus.create('ACTIVE'),
    })

    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      couponCode: coupon.code,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCouponsRepository.items[0].isDisabled()).toBeTruthy()
    }
  })
})
