import { Either, left, right } from '@/core/either'
import { CouponsRepository } from '../repositories/coupons-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Coupon } from '../../enterprise/entities/coupon'

interface GetCouponUseCaseRequest {
  couponCode: string
}

type GetCouponUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    coupon: Coupon
  }
>

@Injectable()
export class GetCouponUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    couponCode,
  }: GetCouponUseCaseRequest): Promise<GetCouponUseCaseResponse> {
    const coupon = await this.couponsRepository.findByCode(couponCode)

    if (!coupon) {
      return left(new ResourceNotFoundError())
    }

    return right({ coupon })
  }
}
