import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'
import { EditCategoryUseCase } from '@/domain/store/application/use-cases/edit-category'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles.decorator'

const editCategoryBodySchema = z.object({
  name: z.string(),
})

type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema)

@Controller('/categories/:id')
export class EditCategoryController {
  constructor(private editCategory: EditCategoryUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @Param('id') categoryId: string,
  ) {
    const { name } = body

    await this.editCategory.execute({
      name,
      categoryId,
    })
  }
}
