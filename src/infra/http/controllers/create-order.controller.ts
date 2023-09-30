import { CreateOrderUseCase } from '@/domain/store/application/use-cases/create-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createOrderSchema = z.object({
  address: z.string(),
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
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @Roles(['CLIENT'])
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { address, items } = body

    const result = await this.createOrder.execute({
      clientId: user.sub,
      address,
      items,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }
  }
}
