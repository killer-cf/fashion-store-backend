import { UseCaseError } from '@/core/errors/use-case-error'

export class BrandAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Brand already exists.')
  }
}
