import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponAlreadyBeenUsedError extends Error implements UseCaseError {
  constructor() {
    super('Coupon already been used.')
  }
}
