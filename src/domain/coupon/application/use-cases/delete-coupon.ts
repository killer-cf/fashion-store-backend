import { Either, left, right } from '@/core/either'
import { CouponsRepository } from '../repositories/coupons-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteCouponUseCaseRequest {
  couponCode: string
}

type DeleteCouponUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteCouponUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    couponCode,
  }: DeleteCouponUseCaseRequest): Promise<DeleteCouponUseCaseResponse> {
    const coupon = await this.couponsRepository.findByCode(couponCode)

    if (!coupon) {
      return left(new ResourceNotFoundError())
    }

    await this.couponsRepository.delete(coupon)

    return right(null)
  }
}
