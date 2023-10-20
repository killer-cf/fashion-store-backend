import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { GetProductUseCase } from '@/domain/store/application/use-cases/get-product'
import { ProductDetailsPresenter } from '../../presenters/product-details-presenter'

@Controller('admin/products/:id')
export class GetProductAdminController {
  constructor(private getProduct: GetProductUseCase) {}

  @Get()
  @Roles(['ADMIN'])
  async handle(@Param('id') id: string) {
    const result = await this.getProduct.execute({
      id,
      isAdmin: true,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const product = ProductDetailsPresenter.toHTTP(result.value.product)

    return { product }
  }
}
