import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { DisableCouponUseCase } from '@/domain/coupon/application/use-cases/disable-coupon'
import { CouponAlreadyDisabledError } from '@/domain/coupon/application/use-cases/errors/coupon-already-disabled-error'

@Controller('/coupons/:code/disable')
export class DisableCouponController {
  constructor(private disableCoupon: DisableCouponUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Param('code') code: string) {
    const result = await this.disableCoupon.execute({
      couponCode: code,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CouponAlreadyDisabledError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
