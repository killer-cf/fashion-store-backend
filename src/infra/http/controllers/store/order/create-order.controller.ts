import { ValidateCouponUseCase } from '@/domain/coupon/application/use-cases/validate-coupon'
import { OrdersRepository } from '@/domain/store/application/repositories/orders-repository'
import { CreateOrderUseCase } from '@/domain/store/application/use-cases/create-order'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
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

const createOrderSchema = z.object({
  address: z.string(),
  couponCode: z.string().optional(),
  value: z.coerce.number(),
  deliveryFee: z.coerce.number(),
  items: z
    .object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
    .array()
    .min(1),
})

type CreateOrderBody = z.infer<typeof createOrderSchema>

const bodyValidationPipe = new ZodValidationPipe(createOrderSchema)

@Controller('/orders')
export class CreateOrderController {
  constructor(
    private createOrder: CreateOrderUseCase,
    private validadeCoupon: ValidateCouponUseCase,
    private ordersRepository: OrdersRepository,
  ) {}

  @Post()
  @Roles(['CLIENT'])
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { address, items, couponCode, value, deliveryFee } = body

    const clientOrders = await this.ordersRepository.findManyByClientId(
      user.sub,
    )

    if (couponCode) {
      const validateCoupon = await this.validadeCoupon.execute({
        code: couponCode,
        value,
        isFirstOrder: clientOrders.length === 0,
        alreadyBeenUsed: clientOrders.some(
          (clientOrder) => clientOrder.couponCode === couponCode,
        ),
      })

      if (validateCoupon.isLeft()) {
        const error = validateCoupon.value
        throw new ConflictException(error.message)
      }
    }

    const createOrder = await this.createOrder.execute({
      clientId: user.sub,
      couponCode,
      address,
      items,
      deliveryFee,
    })

    if (createOrder.isLeft()) {
      const error = createOrder.value

      throw new BadRequestException(error.message)
    }
  }
}
