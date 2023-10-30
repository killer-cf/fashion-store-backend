import { CouponRule } from '../../../../coupon/enterprise/entities/contracts/coupon-rule'
import { Either, left, right } from '@/core/either'
import { CouponExpiredError } from '@/domain/coupon/application/use-cases/errors/coupon-expired-error'
import { CouponMinValueError } from '@/domain/coupon/application/use-cases/errors/coupon-min-value-error'
import { CouponSoldOutError } from '@/domain/coupon/application/use-cases/errors/coupon-sold-out-error'

export class CouponRules {
  private rules: CouponRule[] = []

  addRule(rule: CouponRule) {
    this.rules.push(rule)
  }

  canApplyCoupon(
    orderValue: number,
  ): Either<
    CouponSoldOutError | CouponExpiredError | CouponMinValueError,
    null
  > {
    for (const rule of this.rules) {
      const result = rule.canApply(orderValue)

      if (result.isLeft()) {
        return left(result.value)
      }
    }
    return right(null)
  }
}
