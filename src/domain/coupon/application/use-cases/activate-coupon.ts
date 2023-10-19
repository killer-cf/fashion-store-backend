import { Either, left, right } from '@/core/either'
import { Coupon } from '../../enterprise/entities/coupon'
import { CouponsRepository } from '../repositories/coupons-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouponAlreadyActivatedError } from './errors/coupon-already-activated-error'
import { Injectable } from '@nestjs/common'

interface ActivateCouponUseCaseRequest {
  couponCode: string
}

type ActivateCouponUseCaseResponse = Either<
  ResourceNotFoundError | CouponAlreadyActivatedError,
  {
    coupon: Coupon
  }
>

@Injectable()
export class ActivateCouponUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    couponCode,
  }: ActivateCouponUseCaseRequest): Promise<ActivateCouponUseCaseResponse> {
    const coupon = await this.couponsRepository.findByCode(couponCode)

    if (!coupon) {
      return left(new ResourceNotFoundError())
    }

    if (coupon.isActive()) {
      return left(new CouponAlreadyActivatedError())
    }

    coupon.activate()

    await this.couponsRepository.save(coupon)

    return right({ coupon })
  }
}
