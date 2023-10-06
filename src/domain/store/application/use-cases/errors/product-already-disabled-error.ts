import { UseCaseError } from '@/core/errors/use-case-error'

export class ProductAlreadyDisabledError extends Error implements UseCaseError {
  constructor() {
    super('Product already Disabled.')
  }
}
