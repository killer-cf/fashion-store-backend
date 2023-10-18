import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { ValidateCouponUseCase } from './validate-coupon'
import { Coupon } from '../../enterprise/entities/coupon'
import { CouponStatus } from '../../enterprise/entities/value-objects/coupon-status'
import { FakeDateValidator } from 'test/support/fake-date-validator'
import { CouponExpiredError } from './errors/coupon-expired-error'
import { CouponSoldOutError } from './errors/coupon-sold-out-error'
import { CouponMinValueError } from './errors/coupon-min-value-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

describe('Validate Coupon', () => {
  let inMemoryCouponsRepository: InMemoryCouponsRepository
  let fakeDateValidator: FakeDateValidator
  let sut: ValidateCouponUseCase

  beforeEach(() => {
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    fakeDateValidator = new FakeDateValidator()
    sut = new ValidateCouponUseCase(
      inMemoryCouponsRepository,
      fakeDateValidator,
    )
  })

  it('should be able to validate a coupon and return discount amount', async () => {
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
      value: 10000,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) expect(result.value.couponDiscount).toBe(5000)
  })

  it('should be able to validate a coupon and return discount percentage', async () => {
    const coupon = Coupon.create({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('ACTIVE'),
      quantity: 1000,
      minValue: 10000,
      discount: 10,
      discountType: 'percentage',
      expiresAt: new Date(),
      maxDiscount: 2000,
    })
    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      code: 'PRIMEIRACOMPRA',
      value: 10000,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) expect(result.value.couponDiscount).toBe(1000)
  })

  it('should be able to validate a coupon and return discount percentage when max discount', async () => {
    const coupon = Coupon.create({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('ACTIVE'),
      quantity: 1000,
      minValue: 10000,
      discount: 10,
      discountType: 'percentage',
      expiresAt: new Date(),
      maxDiscount: 500,
    })
    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      code: 'PRIMEIRACOMPRA',
      value: 10000,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) expect(result.value.couponDiscount).toBe(500)
  })

  it('should be able to validate a coupon disabled', async () => {
    const coupon = Coupon.create({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('DISABLED'),
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
      value: 10000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to validate a coupon expired', async () => {
    const coupon = Coupon.create({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('ACTIVE'),
      quantity: 1000,
      minValue: 10000,
      discount: 5000,
      discountType: 'amount',
      expiresAt: new Date('2023-01-01'),
      maxDiscount: 5000,
    })
    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      code: 'PRIMEIRACOMPRA',
      value: 10000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CouponExpiredError)
  })

  it('should be able to validate a coupon sold out', async () => {
    const coupon = Coupon.create({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('ACTIVE'),
      quantity: 0,
      minValue: 10000,
      discount: 5000,
      discountType: 'amount',
      expiresAt: new Date(),
      maxDiscount: 5000,
    })
    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      code: 'PRIMEIRACOMPRA',
      value: 10000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CouponSoldOutError)
  })

  it('should be able to validate a coupon min value', async () => {
    const coupon = Coupon.create({
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('ACTIVE'),
      quantity: 1,
      minValue: 10000,
      discount: 5000,
      discountType: 'amount',
      expiresAt: new Date(),
      maxDiscount: 5000,
    })
    inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      code: 'PRIMEIRACOMPRA',
      value: 9000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CouponMinValueError)
  })
})
