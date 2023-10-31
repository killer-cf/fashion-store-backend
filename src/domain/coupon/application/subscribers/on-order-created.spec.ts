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
import { InMemoryBrandsRepository } from 'test/repositories/in-memory-brands-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryProductCategoriesRepository } from 'test/repositories/in-memory-product-categories-repository'
import { InMemoryProductImagesRepository } from 'test/repositories/in-memory-product-images-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'

describe('On order created', () => {
  let inMemoryProductCategoriesRepository: InMemoryProductCategoriesRepository
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository
  let inMemoryProductImagesRepository: InMemoryProductImagesRepository
  let inMemoryProductsRepository: InMemoryProductsRepository
  let inMemoryBrandsRepository: InMemoryBrandsRepository
  let inMemoryImagesRepository: InMemoryImagesRepository
  let inMemoryCouponsRepository: InMemoryCouponsRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let validateCouponUseCase: ValidateCouponUseCase
  let fakeDateValidator: FakeDateValidator

  let couponsRepositorySave: SpyInstance<[coupon: Coupon], Promise<void>>

  beforeEach(() => {
    fakeDateValidator = new FakeDateValidator()
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    inMemoryProductCategoriesRepository =
      new InMemoryProductCategoriesRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryProductImagesRepository = new InMemoryProductImagesRepository()
    inMemoryBrandsRepository = new InMemoryBrandsRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductImagesRepository,
      inMemoryBrandsRepository,
      inMemoryImagesRepository,
      inMemoryProductCategoriesRepository,
      inMemoryCategoriesRepository,
    )
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryProductsRepository,
    )
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
      discount: 5000,
    })
    const order = makeOrder({
      couponCode: coupon.code,
      subtotal: 10000,
      deliveryFee: 1000,
    })

    inMemoryCouponsRepository.create(coupon)
    inMemoryOrdersRepository.create(order)

    await waitFor(() => expect(couponsRepositorySave).toHaveBeenCalled())
    expect(inMemoryCouponsRepository.items[0].quantity).toBe(9)
    console.log(inMemoryOrdersRepository.items[0].couponValue)
    console.log(inMemoryOrdersRepository.items[0].totalPrice)
    expect(inMemoryOrdersRepository.items[0].couponValue).toBe(5000)
    expect(inMemoryOrdersRepository.items[0].totalPrice).toBe(6000)
  })
})
