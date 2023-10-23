import { PaginationParams } from '@/core/repositories/pagination-params'
import { Coupon } from '../../enterprise/entities/coupon'

export abstract class CouponsRepository {
  abstract findMany(params: PaginationParams): Promise<Coupon[]>
  abstract create(coupon: Coupon): Promise<void>
  abstract findByCode(code: string): Promise<Coupon | null>
  abstract save(coupon: Coupon): Promise<void>
  abstract delete(coupon: Coupon): Promise<void>
}
