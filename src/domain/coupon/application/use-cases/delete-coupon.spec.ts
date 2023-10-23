import { DeleteCouponUseCase } from './delete-coupon'
import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { makeCoupon } from 'test/factories/make-coupon'
import { CouponStatus } from '../../enterprise/entities/value-objects/coupon-status'

describe('Delete coupon', () => {
  let inMemoryCouponsRepository: InMemoryCouponsRepository
  let sut: DeleteCouponUseCase

  beforeEach(() => {
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    sut = new DeleteCouponUseCase(inMemoryCouponsRepository)
  })

  it('should be able to delete coupon', async () => {
    const coupon = makeCoupon({
      status: CouponStatus.create('DISABLED'),
    })

    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      couponCode: coupon.code,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCouponsRepository.items).toHaveLength(0)
    }
  })
})
