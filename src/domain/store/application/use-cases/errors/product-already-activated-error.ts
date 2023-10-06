import { UseCaseError } from '@/core/errors/use-case-error'

export class ProductAlreadyActivatedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Product already activated.')
  }
}
