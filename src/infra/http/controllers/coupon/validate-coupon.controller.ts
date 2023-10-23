import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { ValidateCouponUseCase } from '@/domain/coupon/application/use-cases/validate-coupon'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { CouponSoldOutError } from '@/domain/coupon/application/use-cases/errors/coupon-sold-out-error'
import { CouponExpiredError } from '@/domain/coupon/application/use-cases/errors/coupon-expired-error'
import { CouponMinValueError } from '@/domain/coupon/application/use-cases/errors/coupon-min-value-error'

const valueQueryParamSchema = z
  .string()
  .transform(Number)
  .pipe(z.number().min(1))

const valueQueryValidationPipe = new ZodValidationPipe(valueQueryParamSchema)

type ValueQueryParamSchema = z.infer<typeof valueQueryParamSchema>

@Controller('/coupons/:code/validate')
export class ValidateCouponController {
  constructor(private validateCoupon: ValidateCouponUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(
    @Param('code') code: string,
    @Query('value', valueQueryValidationPipe) value: ValueQueryParamSchema,
  ) {
    const result = await this.validateCoupon.execute({
      code,
      value,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CouponSoldOutError:
        case CouponExpiredError:
        case CouponMinValueError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
