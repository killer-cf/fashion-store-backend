import { Either } from '@/core/either'
import { CouponExpiredError } from '@/domain/coupon/application/use-cases/errors/coupon-expired-error'
import { CouponMinValueError } from '@/domain/coupon/application/use-cases/errors/coupon-min-value-error'
import { CouponSoldOutError } from '@/domain/coupon/application/use-cases/errors/coupon-sold-out-error'

export interface CouponRule {
  canApply(
    orderValue: number,
  ): Either<CouponSoldOutError | CouponExpiredError | CouponMinValueError, null>
}
