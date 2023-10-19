import { Either, left, right } from '@/core/either'
import { Coupon } from '../../enterprise/entities/coupon'
import { CouponsRepository } from '../repositories/coupons-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouponAlreadyDisabledError } from './errors/coupon-already-disabled-error'
import { Injectable } from '@nestjs/common'

interface DisableCouponUseCaseRequest {
  couponCode: string
}

type DisableCouponUseCaseResponse = Either<
  ResourceNotFoundError | CouponAlreadyDisabledError,
  {
    coupon: Coupon
  }
>

@Injectable()
export class DisableCouponUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    couponCode,
  }: DisableCouponUseCaseRequest): Promise<DisableCouponUseCaseResponse> {
    const coupon = await this.couponsRepository.findByCode(couponCode)

    if (!coupon) {
      return left(new ResourceNotFoundError())
    }

    if (coupon.isDisabled()) {
      return left(new CouponAlreadyDisabledError())
    }

    coupon.disable()

    await this.couponsRepository.save(coupon)

    return right({ coupon })
  }
}
