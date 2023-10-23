import { Coupon } from '@/domain/coupon/enterprise/entities/coupon'

export class CouponPresenter {
  static oneToHTTP(coupon: Coupon) {
    return {
      id: coupon.id.toString(),
      code: coupon.code,
      description: coupon.description,
      quantity: coupon.quantity,
      status: coupon.status,
      discount: coupon.discount,
      discountType: coupon.discountType,
      maxDiscount: coupon.maxDiscount,
      minValue: coupon.minValue,
      expiresAt: coupon.expiresAt,
      createdAt: coupon.createdAt,
    }
  }

  static listToHTTP(coupons: Coupon[]) {
    return coupons.map((coupon) => {
      return {
        id: coupon.id.toString(),
        code: coupon.code,
        status: coupon.status,
        discount: coupon.discount,
        discountType: coupon.discountType,
      }
    })
  }
}
