import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Coupon, CouponProps } from '@/domain/coupon/enterprise/entities/coupon'
import { CouponStatus } from '@/domain/coupon/enterprise/entities/value-objects/coupon-status'
import { faker } from '@faker-js/faker'

export function makeCoupon(
  override: Partial<CouponProps> = {},
  id?: UniqueEntityID,
) {
  const coupon = Coupon.create(
    {
      code: 'PRIMEIRACOMPRA',
      description: 'Cupom de primeira compra',
      status: CouponStatus.create('ACTIVE'),
      quantity: 1000,
      minValue: 10000,
      discount: 5000,
      discountType: 'amount',
      expiresAt: faker.date.future(),
      maxDiscount: 5000,
      ...override,
    },
    id,
  )

  return coupon
}
