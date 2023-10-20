import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles.decorator'
import { DisableProductUseCase } from '@/domain/store/application/use-cases/disable-product'
import { ProductAlreadyDisabledError } from '@/domain/store/application/use-cases/errors/product-already-disabled-error'

@Controller('/products/:productId/disable')
export class DisableProductController {
  constructor(private disableProduct: DisableProductUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles(['ADMIN'])
  async handle(@Param('productId') productId: string) {
    const result = await this.disableProduct.execute({
      productId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProductAlreadyDisabledError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
