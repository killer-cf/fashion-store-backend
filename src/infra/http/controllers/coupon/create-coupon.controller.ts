import { CreateCouponUseCase } from '@/domain/coupon/application/use-cases/create-coupon'
import { CouponAlreadyExistsError } from '@/domain/coupon/application/use-cases/errors/coupon-already-exists-error'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

const createCouponSchema = z.object({
  code: z.string(),
  status: z.enum(['ACTIVE', 'DISABLED']),
  description: z.string(),
  discount: z.number(),
  discountType: z.enum(['percentage', 'amount']),
  maxDiscount: z.number(),
  minValue: z.number(),
  quantity: z.number(),
  expiresAt: z.coerce.date(),
  isSingleUse: z.boolean(),
  isFirstOrder: z.boolean(),
  isFreeShipping: z.boolean(),
})

type CreateCouponBody = z.infer<typeof createCouponSchema>

const bodyValidationPipe = new ZodValidationPipe(createCouponSchema)

@Controller('/coupons')
export class CreateCouponController {
  constructor(private createCoupon: CreateCouponUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateCouponBody) {
    const {
      code,
      status,
      description,
      discount,
      discountType,
      maxDiscount,
      minValue,
      quantity,
      expiresAt,
      isSingleUse,
      isFirstOrder,
      isFreeShipping,
    } = body

    const result = await this.createCoupon.execute({
      code,
      status,
      description,
      discount,
      discountType,
      maxDiscount,
      minValue,
      quantity,
      expiresAt,
      isSingleUse,
      isFirstOrder,
      isFreeShipping,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CouponAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
