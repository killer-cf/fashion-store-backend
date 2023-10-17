import { Coupon } from '../../enterprise/entities/coupon'

export abstract class CouponsRepository {
  abstract create(coupon: Coupon): Promise<void>
  abstract findByCode(code: string): Promise<Coupon | null>
}
