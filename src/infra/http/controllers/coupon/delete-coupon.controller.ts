import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { DeleteCouponUseCase } from '@/domain/coupon/application/use-cases/delete-coupon'

@Controller('/coupons/:code')
export class DeleteCouponController {
  constructor(private deleteCoupon: DeleteCouponUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Param('code') code: string) {
    const result = await this.deleteCoupon.execute({
      couponCode: code,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
