import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponExpiredError extends Error implements UseCaseError {
  constructor() {
    super('Coupon expired.')
  }
}
