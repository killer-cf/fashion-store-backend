import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { Public } from '@/infra/auth/public.decorator'
import { ListProductsByCategoryUseCase } from '@/domain/store/application/use-cases/list-products-by-category'
import { ProductPresenter } from '@/infra/http/presenters/product-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryParamSchema = z.object({
  page: pageQueryParamSchema,
  search: z.string(),
})

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>

@Controller('/products/categories/:categoryId')
export class ListProductsByCategoryController {
  constructor(private listProductsByCategory: ListProductsByCategoryUseCase) {}

  @Public()
  @Get()
  async handle(
    @Query(queryValidationPipe) query: QueryParamSchema,
    @Param('categoryId') categoryId: string,
  ) {
    const { page, search } = query

    const result = await this.listProductsByCategory.execute({
      page,
      search,
      categoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const products = result.value.products.map((product) =>
      ProductPresenter.toHTTP(product),
    )

    return { products }
  }
}
