import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { ProductAlreadyExistsError } from '@/domain/store/application/use-cases/errors/product-already-exists-error'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
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
  constructor(private createProduct: CreateProductUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async handle(@Body() body: CreateProductBody) {
    const { name, price, sku, brand, model, color } = body

    const result = await this.createProduct.execute({
      name,
      price,
      sku,
      brand,
      model,
      color,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProductAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
