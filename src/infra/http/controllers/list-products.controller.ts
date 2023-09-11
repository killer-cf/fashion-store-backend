import { ListProductsUseCase } from '@/domain/store/application/use-cases/list-products'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ProductPresenter } from '../presenters/product-presenter'
import { Public } from '@/infra/auth/public'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/products')
export class ListProductsController {
  constructor(private listProducts: ListProductsUseCase) {}

  @Public()
  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.listProducts.execute({
      page,
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
