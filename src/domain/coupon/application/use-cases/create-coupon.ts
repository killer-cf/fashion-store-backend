import { Either, left, right } from '@/core/either'
import { Coupon } from '../../enterprise/entities/coupon'
import { CouponsRepository } from '../repositories/coupons-repository'
import { Injectable } from '@nestjs/common'
import { CouponAlreadyExistsError } from './errors/coupon-already-exists-error'
import { CouponStatus } from '../../enterprise/entities/value-objects/coupon-status'

interface CreateCouponUseCaseRequest {
  code: string
  description: string
  discount: number
  status: 'ACTIVE' | 'DISABLED'
  discountType: 'percentage' | 'amount'
  maxDiscount: number
  minValue: number
  quantity: number
  expiresAt: Date
}

type CreateCouponUseCaseResponse = Either<
  CouponAlreadyExistsError,
  {
    coupon: Coupon
  }
>

@Injectable()
export class CreateCouponUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    code,
    description,
    discount,
    status,
    discountType,
    maxDiscount,
    minValue,
    quantity,
    expiresAt,
  }: CreateCouponUseCaseRequest): Promise<CreateCouponUseCaseResponse> {
    const couponOnRepository = await this.couponsRepository.findByCode(code)

    if (couponOnRepository) {
      return left(new CouponAlreadyExistsError())
    }

    const coupon = Coupon.create({
      code,
      description,
      discount,
      status: CouponStatus.create(status),
      discountType,
      maxDiscount,
      minValue,
      quantity,
      expiresAt,
    })

    await this.couponsRepository.create(coupon)

    return right({ coupon })
  }
}
