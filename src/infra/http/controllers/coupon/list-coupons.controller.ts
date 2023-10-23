import { ListCouponsUseCase } from '@/domain/coupon/application/use-cases/list-coupons'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { CouponPresenter } from '../../presenters/coupon-presenter'
import { Roles } from '@/infra/auth/roles.decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/coupons')
export class ListCouponsController {
  constructor(private listCoupons: ListCouponsUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.listCoupons.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const coupons = CouponPresenter.listToHTTP(result.value.coupons)

    return { coupons }
  }
}
