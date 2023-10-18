import { Either, left, right } from '@/core/either'
import { CouponsRepository } from '../repositories/coupons-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouponSoldOutError } from './errors/coupon-sold-out-error'
import { DateValidator } from '../support/date-validator'
import { CouponExpiredError } from './errors/coupon-expired-error'
import { CouponMinValueError } from './errors/coupon-min-value-error'

interface ValidateCouponUseCaseRequest {
  value: number
  code: string
}

type ValidateCouponUseCaseResponse = Either<
  | ResourceNotFoundError
  | CouponSoldOutError
  | CouponExpiredError
  | CouponMinValueError,
  {
    couponDiscount: number
  }
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
  }: ValidateCouponUseCaseRequest): Promise<ValidateCouponUseCaseResponse> {
    const coupon = await this.couponsRepository.findByCode(code)

    if (!coupon || coupon.isDisabled()) return left(new ResourceNotFoundError())

    if (coupon.quantity === 0) return left(new CouponSoldOutError())

    if (this.dateValidator.isExpired(coupon.expiresAt))
      return left(new CouponExpiredError())

    if (value < coupon.minValue) return left(new CouponMinValueError())

    return right({
      couponDiscount: coupon.finalDiscount(value),
    })
  }
}
