import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  sku: z.string(),
  brand: z.string(),
  model: z.string(),
  color: z.string(),
})

type CreateProductBody = z.infer<typeof createProductSchema>

@Controller('/products')
export class CreateProductController {
  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async handle(@Body() body: CreateProductBody) {
    console.log(body)
  }
}
