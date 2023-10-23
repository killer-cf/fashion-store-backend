import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponAlreadyDisabledError extends Error implements UseCaseError {
  constructor() {
    super('Coupon already Disabled.')
  }
}
