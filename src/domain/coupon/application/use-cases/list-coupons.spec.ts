import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { ListCouponsUseCase } from './list-coupons'
import { makeCoupon } from 'test/factories/make-coupon'

describe('List Coupons', () => {
  let inMemoryCouponsRepository: InMemoryCouponsRepository
  let sut: ListCouponsUseCase

  beforeEach(() => {
    inMemoryCouponsRepository = new InMemoryCouponsRepository()
    sut = new ListCouponsUseCase(inMemoryCouponsRepository)
  })

  it('should be able to list coupons', async () => {
    inMemoryCouponsRepository.create(makeCoupon())
    inMemoryCouponsRepository.create(makeCoupon())

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouponsRepository.items).toHaveLength(2)
  })

  it('should be able to list paginated coupons', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryCouponsRepository.create(
        makeCoupon({
          code: `Coupon${i}`,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.coupons).toHaveLength(2)
    expect(result.value?.coupons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'Coupon21' }),
        expect.objectContaining({ code: 'Coupon22' }),
      ]),
    )
  })
})
