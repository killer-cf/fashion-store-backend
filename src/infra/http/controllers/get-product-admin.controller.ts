import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { Public } from '@/infra/auth/public.decorator'
import { GetProductUseCase } from '@/domain/store/application/use-cases/get-product'

@Controller('admin/products/:id')
export class GetProductAdminController {
  constructor(private getProduct: GetProductUseCase) {}

  @Get()
  @Public()
  async handle(@Param('id') id: string) {
    const result = await this.getProduct.execute({
      id,
      isAdmin: true,
    })

    if (result.isLeft()) {
      console.log(result.value)
      throw new BadRequestException()
    }

    const product = result.value.product

    return { product }
  }
}
