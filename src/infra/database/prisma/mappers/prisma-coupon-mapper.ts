import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Coupon } from '@/domain/coupon/enterprise/entities/coupon'
import { CouponStatus } from '@/domain/coupon/enterprise/entities/value-objects/coupon-status'
import { Prisma, Coupon as PrismaCoupon } from '@prisma/client'

export class PrismaCouponMapper {
  static toDomain(raw: PrismaCoupon): Coupon {
    if (raw.discountType !== 'amount' && raw.discountType !== 'percentage') {
      throw new Error('Coupon type invalid')
    }

    return Coupon.create(
      {
        code: raw.code,
        description: raw.description,
        discount: raw.discount,
        discountType: raw.discountType,
        maxDiscount: raw.maxDiscount,
        quantity: raw.quantity,
        minValue: raw.minValue,
        status: CouponStatus.create(raw.status),
        expiresAt: raw.expiresAt,
        isFirstOrder: raw.isFirstOrder,
        isFreeShipping: raw.isFreeShipping,
        isSingleUse: raw.isSingleUse,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(coupon: Coupon): Prisma.CouponUncheckedCreateInput {
    return {
      id: coupon.id.toString(),
      code: coupon.code,
      description: coupon.description,
      discount: coupon.discount,
      discountType: coupon.discountType,
      maxDiscount: coupon.maxDiscount,
      quantity: coupon.quantity,
      minValue: coupon.minValue,
      isFirstOrder: coupon.isFirstOrder,
      isFreeShipping: coupon.isFreeShipping,
      isSingleUse: coupon.isSingleUse,
      status: coupon.status.getValue(),
      expiresAt: coupon.expiresAt,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    }
  }
}
