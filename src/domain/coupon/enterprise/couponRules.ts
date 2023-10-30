import { CouponRule } from '../../coupon/enterprise/entities/contracts/coupon-rule'
import { CouponMinValueError } from '../application/use-cases/errors/coupon-min-value-error'
import { CouponSoldOutError } from '../application/use-cases/errors/coupon-sold-out-error'
import { CouponExpiredError } from '../application/use-cases/errors/coupon-expired-error'
import { Either, left, right } from '@/core/either'

export class MinValueRule implements CouponRule {
  constructor(private minValue: number) {}

  canApply(
    orderValue: number,
  ): Either<
    CouponSoldOutError | CouponExpiredError | CouponMinValueError,
    null
  > {
    if (orderValue < this.minValue) {
      return left(new CouponMinValueError())
    }
    return right(null)
  }
}
