import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { CreateCouponUseCase } from './create-coupon'
import { Coupon } from '../../enterprise/entities/coupon'
import { CouponStatus } from '../../enterprise/entities/value-objects/coupon-status'

describe('Create Coupon', () => {
  let inMemoryCouponsRepository: InMemoryCouponsRepository
  let sut: CreateCouponUseCase

  beforeEach(() => {
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    sut = new CreateCouponUseCase(inMemoryCouponsRepository)
  })

  it('should be able to create a coupon', async () => {
    const result = await sut.execute({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: 'ACTIVE',
      quantity: 1000,
      minValue: 10000,
      discount: 5000,
      discountType: 'amount',
      expiresAt: new Date(),
      maxDiscount: 5000,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryCouponsRepository.items[0]).toEqual(result.value?.coupon)
    }
  })

  it('should not be able to duplicate a coupon', async () => {
    const coupon = Coupon.create({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('ACTIVE'),
      quantity: 1000,
      minValue: 10000,
      discount: 5000,
      discountType: 'amount',
      expiresAt: new Date(),
      maxDiscount: 5000,
    })
    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: 'ACTIVE',
      quantity: 1000,
      minValue: 10000,
      discount: 5000,
      discountType: 'amount',
      expiresAt: new Date(),
      maxDiscount: 5000,
    })

    expect(result.isLeft()).toBe(true)
  })
})
