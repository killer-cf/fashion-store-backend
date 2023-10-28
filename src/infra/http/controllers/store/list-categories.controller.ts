import { ListCategoriesUseCase } from '@/domain/store/application/use-cases/list-categories'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { CategoryPresenter } from '../../presenters/category-presenter'
import { Public } from '@/infra/auth/public.decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/categories')
export class ListCategoriesController {
  constructor(private listCategories: ListCategoriesUseCase) {}

  @Get()
  @Public()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.listCategories.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const categories = result.value.categories.map((category) =>
      CategoryPresenter.toHTTP(category),
    )

    return { categories }
  }
}
