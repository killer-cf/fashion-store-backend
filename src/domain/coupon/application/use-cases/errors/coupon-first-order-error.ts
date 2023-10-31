import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponFirstOrderError extends Error implements UseCaseError {
  constructor() {
    super('Coupon valid only for first order.')
  }
}
