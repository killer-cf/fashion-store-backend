import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Coupon already exists.')
  }
}
