import { CreateCouponUseCase } from '@/domain/coupon/application/use-cases/create-coupon'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateCouponController } from './create-coupon.controller'
import { ActivateCouponController } from './activate-coupon.controller'
import { ActivateCouponUseCase } from '@/domain/coupon/application/use-cases/activate-coupon'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateCouponController, ActivateCouponController],
  providers: [CreateCouponUseCase, ActivateCouponUseCase],
})
export class CouponControllersModule {}
