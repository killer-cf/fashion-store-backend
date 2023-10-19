import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { makeCoupon } from 'test/factories/make-coupon'
import { CouponStatus } from '../../enterprise/entities/value-objects/coupon-status'
import { GetCouponUseCase } from './get-coupon'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Get coupon', () => {
  let inMemoryCouponsRepository: InMemoryCouponsRepository

  let sut: GetCouponUseCase

  beforeEach(() => {
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    sut = new GetCouponUseCase(inMemoryCouponsRepository)
  })

  it('should be able to a coupon', async () => {
    const coupon = makeCoupon({
      status: CouponStatus.create('ACTIVE'),
      code: 'PRIMEIRACOMPRA',
    })
    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      couponCode: 'PRIMEIRACOMPRA',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCouponsRepository.items[0]).toEqual(coupon)
    }
  })

  it('should return resource not found when not found a coupon', async () => {
    const result = await sut.execute({
      couponCode: 'PRIMEIRACOMPRA',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
