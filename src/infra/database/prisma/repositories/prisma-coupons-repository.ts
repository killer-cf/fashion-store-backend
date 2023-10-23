import { Coupon } from '@/domain/coupon/enterprise/entities/coupon'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CouponsRepository } from '@/domain/coupon/application/repositories/coupons-repository'
import { PrismaCouponMapper } from '../mappers/prisma-coupon-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

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

  async findMany({ page }: PaginationParams): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return coupons.map(PrismaCouponMapper.toDomain)
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

  async delete(coupon: Coupon): Promise<void> {
    const data = PrismaCouponMapper.toPrisma(coupon)

    await this.prisma.coupon.delete({
      where: {
        id: data.id,
      },
    })
  }
}
