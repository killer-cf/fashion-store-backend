import { CreateCouponUseCase } from '@/domain/coupon/application/use-cases/create-coupon'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateCouponController } from './create-coupon.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateCouponController],
  providers: [CreateCouponUseCase],
})
export class CouponControllersModule {}
