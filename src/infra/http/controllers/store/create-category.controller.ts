import { CreateCategoryUseCase } from '@/domain/store/application/use-cases/create-category'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string(),
  subCategoriesIds: z.array(z.string()),
})

type CreateCategoryBody = z.infer<typeof createCategorySchema>

const bodyValidationPipe = new ZodValidationPipe(createCategorySchema)

@Controller('/categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  @Roles(['ADMIN'])
  async handle(@Body(bodyValidationPipe) body: CreateCategoryBody) {
    const { name, subCategoriesIds } = body

    const result = await this.createCategory.execute({ name, subCategoriesIds })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      categoryId: result.value.category.id.toString(),
    }
  }
}
