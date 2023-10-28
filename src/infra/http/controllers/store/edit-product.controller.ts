import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'
import { EditProductUseCase } from '@/domain/store/application/use-cases/edit-product'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'

const editProductBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  colors: z.array(z.string()).min(1),
  imageIds: z.array(z.string()).min(1),
  categoriesIds: z.array(z.string()).min(1),
})

type EditProductBodySchema = z.infer<typeof editProductBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema)

@Controller('/products/:id')
export class EditProductController {
  constructor(private editProduct: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(
    @Body(bodyValidationPipe) body: EditProductBodySchema,
    @Param('id') productId: string,
  ) {
    const { name, price, colors, description, categoriesIds, imageIds } = body

    await this.editProduct.execute({
      productId,
      name,
      price,
      colors,
      description,
      categoriesIds,
      imageIds,
    })
  }
}
