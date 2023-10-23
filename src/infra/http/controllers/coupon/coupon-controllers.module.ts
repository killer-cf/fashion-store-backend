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
import { GetCouponController } from './get-coupon.controller'
import { GetCouponUseCase } from '@/domain/coupon/application/use-cases/get-coupon'
import { DeleteCouponController } from './delete-coupon.controller'
import { DeleteCouponUseCase } from '@/domain/coupon/application/use-cases/delete-coupon'
import { ValidateCouponController } from './validate-coupon.controller'
import { ValidateCouponUseCase } from '@/domain/coupon/application/use-cases/validate-coupon'
import { DateValidationModule } from '@/infra/date-validation/date-validation.module'

@Module({
  imports: [DatabaseModule, DateValidationModule],
  controllers: [
    CreateCouponController,
    ActivateCouponController,
    DisableCouponController,
    ListCouponsController,
    GetCouponController,
    DeleteCouponController,
    ValidateCouponController,
  ],
  providers: [
    CreateCouponUseCase,
    ActivateCouponUseCase,
    DisableCouponUseCase,
    ListCouponsUseCase,
    GetCouponUseCase,
    DeleteCouponUseCase,
    ValidateCouponUseCase,
  ],
})
export class CouponControllersModule {}
