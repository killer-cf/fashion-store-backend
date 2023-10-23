import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Coupon, CouponProps } from '@/domain/coupon/enterprise/entities/coupon'
import { CouponStatus } from '@/domain/coupon/enterprise/entities/value-objects/coupon-status'
import { PrismaCouponMapper } from '@/infra/database/prisma/mappers/prisma-coupon-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class CouponFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCoupon(data: Partial<CouponProps> = {}): Promise<Coupon> {
    const coupon = makeCoupon(data)

    await this.prisma.coupon.create({
      data: PrismaCouponMapper.toPrisma(coupon),
    })

    return coupon
  }
}
