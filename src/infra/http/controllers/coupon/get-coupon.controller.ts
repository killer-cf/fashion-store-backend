import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetCouponUseCase } from '@/domain/coupon/application/use-cases/get-coupon'
import { CouponPresenter } from '../../presenters/coupon-presenter'
import { Roles } from '@/infra/auth/roles.decorator'

@Controller('/coupons/:code')
export class GetCouponController {
  constructor(private getCoupon: GetCouponUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(@Param('code') code: string) {
    const result = await this.getCoupon.execute({
      couponCode: code,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const coupon = CouponPresenter.oneToHTTP(result.value.coupon)

    return { coupon }
  }
}
