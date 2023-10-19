import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponAlreadyActivatedError extends Error implements UseCaseError {
  constructor() {
    super('Coupon already activated.')
  }
}
