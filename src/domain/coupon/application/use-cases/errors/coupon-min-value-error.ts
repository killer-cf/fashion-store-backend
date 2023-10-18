import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponMinValueError extends Error implements UseCaseError {
  constructor() {
    super('Minimum purchase value not reached')
  }
}
