import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { Public } from '@/infra/auth/public.decorator'
import { GetProductUseCase } from '@/domain/store/application/use-cases/get-product'
import { ProductDetailsPresenter } from '../presenters/product-details-presenter'

@Controller('/products/:id')
export class GetProductController {
  constructor(private getProduct: GetProductUseCase) {}

  @Get()
  @Public()
  async handle(@Param('id') id: string) {
    const result = await this.getProduct.execute({
      id,
      isAdmin: false,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const product = ProductDetailsPresenter.toHTTP(result.value.product)

    return { product }
  }
}
