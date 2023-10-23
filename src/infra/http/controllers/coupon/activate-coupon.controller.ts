import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { ActivateCouponUseCase } from '@/domain/coupon/application/use-cases/activate-coupon'
import { CouponAlreadyActivatedError } from '@/domain/coupon/application/use-cases/errors/coupon-already-activated-error'

@Controller('/coupons/:code/activate')
export class ActivateCouponController {
  constructor(private activateCoupon: ActivateCouponUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Param('code') code: string) {
    const result = await this.activateCoupon.execute({
      couponCode: code,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CouponAlreadyActivatedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
