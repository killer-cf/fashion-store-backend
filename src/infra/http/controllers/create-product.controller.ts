import { CreateProductUseCase } from '@/domain/store/application/use-cases/create-product'
import { ProductAlreadyExistsError } from '@/domain/store/application/use-cases/errors/product-already-exists-error'
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

const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  sku: z.string(),
  brandName: z.string(),
  model: z.string(),
  colors: z.array(z.string()).min(1),
  imageIds: z.array(z.string()).min(1),
})

type CreateProductBody = z.infer<typeof createProductSchema>

const bodyValidationPipe = new ZodValidationPipe(createProductSchema)

@Controller('/products')
export class CreateProductController {
  constructor(private createProduct: CreateProductUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateProductBody) {
    const {
      name,
      description,
      price,
      sku,
      brandName,
      model,
      colors,
      imageIds,
    } = body

    const result = await this.createProduct.execute({
      name,
      description,
      price,
      sku,
      brandName,
      model,
      colors,
      imageIds,
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
