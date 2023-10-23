import { ListProductsUseCase } from '@/domain/store/application/use-cases/list-products'
import { ZodValidationPipe } from '@/infra/pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ProductPresenter } from '../../presenters/product-presenter'
import { Roles } from '@/infra/auth/roles.decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/admin/products')
export class ListProductsAdminController {
  constructor(private listProducts: ListProductsUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.listProducts.execute({
      page,
      isAdmin: true,
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
