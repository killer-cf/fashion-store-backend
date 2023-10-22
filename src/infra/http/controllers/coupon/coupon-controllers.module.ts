import { CreateCouponUseCase } from '@/domain/coupon/application/use-cases/create-coupon'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateCouponController } from './create-coupon.controller'
import { ActivateCouponController } from './activate-coupon.controller'
import { ActivateCouponUseCase } from '@/domain/coupon/application/use-cases/activate-coupon'
import { DisableCouponController } from './disable-coupon.controller'
import { DisableCouponUseCase } from '@/domain/coupon/application/use-cases/disable-coupon'
import { ListCouponsController } from './list-coupons.controller'
import { ListCouponsUseCase } from '@/domain/coupon/application/use-cases/list-coupons'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCouponController,
    ActivateCouponController,
    DisableCouponController,
    ListCouponsController,
  ],
  providers: [
    CreateCouponUseCase,
    ActivateCouponUseCase,
    DisableCouponUseCase,
    ListCouponsUseCase,
  ],
})
export class CouponControllersModule {}
