import { CreateOrderUseCase } from '@/domain/store/application/use-cases/create-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const itemSchema = z.object({
  productId: z.string(),
  quantity: z.string().optional().transform(Number).pipe(z.number().min(1)),
})

const createOrderSchema = z.object({
  address: z.string(),
  items: z.array(itemSchema),
})

type CreateOrderBody = z.infer<typeof createOrderSchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async handle(
    @Body() body: CreateOrderBody,
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
