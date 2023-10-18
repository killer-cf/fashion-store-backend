import { Coupon } from '@/domain/coupon/enterprise/entities/coupon'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CouponsRepository } from '@/domain/coupon/application/repositories/coupons-repository'
import { PrismaCouponMapper } from '../mappers/prisma-coupon-mapper'

@Injectable()
export class PrismaCouponsRepository implements CouponsRepository {
  constructor(private prisma: PrismaService) {}
  async findByCode(code: string): Promise<Coupon | null> {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        code,
      },
    })

    if (!coupon) {
      return null
    }

    return PrismaCouponMapper.toDomain(coupon)
  }

  async create(coupon: Coupon): Promise<void> {
    const data = PrismaCouponMapper.toPrisma(coupon)

    await this.prisma.coupon.create({
      data,
    })
  }

  async save(coupon: Coupon): Promise<void> {
    const data = PrismaCouponMapper.toPrisma(coupon)

    await this.prisma.coupon.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
