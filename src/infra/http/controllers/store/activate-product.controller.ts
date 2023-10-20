import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { ActivateProductUseCase } from '@/domain/store/application/use-cases/activate-product'
import { ProductAlreadyActivatedError } from '@/domain/store/application/use-cases/errors/product-already-activated-error'

@Controller('/products/:productId/activate')
export class ActivateProductController {
  constructor(private activateProduct: ActivateProductUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Param('productId') productId: string) {
    const result = await this.activateProduct.execute({
      productId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProductAlreadyActivatedError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
