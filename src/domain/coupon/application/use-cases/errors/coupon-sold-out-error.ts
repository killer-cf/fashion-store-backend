import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponSoldOutError extends Error implements UseCaseError {
  constructor() {
    super('Coupon sold out.')
  }
}
