import { Either, left, right } from '@/core/either'
import { CouponsRepository } from '../repositories/coupons-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouponSoldOutError } from './errors/coupon-sold-out-error'
import { DateValidator } from '../support/date-validator'
import { CouponExpiredError } from './errors/coupon-expired-error'
import { CouponMinValueError } from './errors/coupon-min-value-error'
import { CouponFirstOrderError } from './errors/coupon-first-order-error'
import { CouponAlreadyBeenUsedError } from './errors/coupon-already-been-used-error'

interface ValidateCouponUseCaseRequest {
  value: number
  code: string
  isFirstOrder: boolean
  alreadyBeenUsed: boolean
}

type ValidateCouponUseCaseResponse = Either<
  | ResourceNotFoundError
  | CouponSoldOutError
  | CouponExpiredError
  | CouponMinValueError
  | CouponFirstOrderError
  | CouponAlreadyBeenUsedError,
  null
>

@Injectable()
export class ValidateCouponUseCase {
  constructor(
    private couponsRepository: CouponsRepository,
    private dateValidator: DateValidator,
  ) {}

  async execute({
    value,
    code,
    isFirstOrder,
    alreadyBeenUsed,
  }: ValidateCouponUseCaseRequest): Promise<ValidateCouponUseCaseResponse> {
    if (alreadyBeenUsed) {
      return left(new CouponAlreadyBeenUsedError())
    }

    const coupon = await this.couponsRepository.findByCode(code)

    if (!coupon || coupon.isDisabled()) return left(new ResourceNotFoundError())

    if (coupon.quantity === 0) return left(new CouponSoldOutError())

    if (this.dateValidator.isExpired(coupon.expiresAt))
      return left(new CouponExpiredError())

    if (coupon.isFirstOrder && !isFirstOrder) {
      return left(new CouponFirstOrderError())
    }

    const checkEspecialRules = coupon.checkRules(value)

    if (checkEspecialRules?.isLeft()) {
      return left(checkEspecialRules.value)
    }

    return right(null)
  }
}
