import { PaginationParams } from '@/core/repositories/pagination-params'
import { CouponsRepository } from '@/domain/coupon/application/repositories/coupons-repository'
import { Coupon } from '@/domain/coupon/enterprise/entities/coupon'

export class InMemoryCouponsRepository implements CouponsRepository {
  public items: Coupon[] = []

  async findByCode(code: string): Promise<Coupon | null> {
    const coupon = this.items.find(
      (coupon) => coupon.code.toLowerCase() === code.toLowerCase(),
    )

    if (!coupon) {
      return null
    }

    return coupon
  }

  async findMany({ page }: PaginationParams): Promise<Coupon[]> {
    const coupons = this.items.slice((page - 1) * 20, page * 20)

    return coupons
  }

  async create(coupon: Coupon): Promise<void> {
    this.items.push(coupon)
  }

  async save(coupon: Coupon): Promise<void> {
    const couponIndex = this.items.findIndex((item) => item.id === coupon.id)

    this.items[couponIndex] = coupon
  }

  async delete(coupon: Coupon) {
    const itemIndex = this.items.findIndex((item) => item.id === coupon.id)

    this.items.splice(itemIndex, 1)
  }
}
