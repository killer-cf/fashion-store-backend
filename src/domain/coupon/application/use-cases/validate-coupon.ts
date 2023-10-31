import { Either, left, right } from '@/core/either'
import { CouponsRepository } from '../repositories/coupons-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouponSoldOutError } from './errors/coupon-sold-out-error'
import { DateValidator } from '../support/date-validator'
import { CouponExpiredError } from './errors/coupon-expired-error'
import { CouponMinValueError } from './errors/coupon-min-value-error'
import { Coupon } from '../../enterprise/entities/coupon'
import { CouponFirstOrderError } from './errors/coupon-first-order-error'

interface ValidateCouponUseCaseRequest {
  value: number
  code: string
  isFirstOrder: boolean
}

type DiscountReturnType = 'freeShipping' | 'forItems'

type ValidateCouponUseCaseResponse = Either<
  | ResourceNotFoundError
  | CouponSoldOutError
  | CouponExpiredError
  | CouponMinValueError
  | CouponFirstOrderError,
  {
    coupon: Coupon
    discountType: DiscountReturnType
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
    isFirstOrder,
  }: ValidateCouponUseCaseRequest): Promise<ValidateCouponUseCaseResponse> {
    const coupon = await this.couponsRepository.findByCode(code)

    if (!coupon || coupon.isDisabled()) return left(new ResourceNotFoundError())

    let discountType: DiscountReturnType = 'forItems'

    let couponDiscount = coupon.finalDiscount(value)

    if (coupon.quantity === 0) return left(new CouponSoldOutError())

    if (this.dateValidator.isExpired(coupon.expiresAt))
      return left(new CouponExpiredError())

    if (coupon.isFreeShipping) {
      discountType = 'freeShipping'
      couponDiscount = 0
    }

    if (coupon.isFirstOrder && !isFirstOrder) {
      return left(new CouponFirstOrderError())
    }

    const checkEspecialRules = coupon.checkRules(value)

    if (checkEspecialRules?.isLeft()) {
      return left(checkEspecialRules.value)
    }

    return right({
      couponDiscount,
      discountType,
      coupon,
    })
  }
}
