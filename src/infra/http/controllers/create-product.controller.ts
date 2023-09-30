import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { ProductAlreadyExistsError } from '@/domain/store/application/use-cases/errors/product-already-exists-error'
import { Roles } from '@/infra/auth/roles'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  sku: z.string(),
  brandName: z.string(),
  model: z.string(),
  color: z.string(),
})

type CreateProductBody = z.infer<typeof createProductSchema>

const bodyValidationPipe = new ZodValidationPipe(createProductSchema)

@Controller('/products')
export class CreateProductController {
  constructor(private createProduct: CreateProductUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateProductBody) {
    const { name, price, sku, brandName, model, color } = body

    const result = await this.createProduct.execute({
      name,
      price,
      sku,
      brandName,
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
