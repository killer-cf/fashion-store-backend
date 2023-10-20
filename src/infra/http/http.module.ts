import { Module } from '@nestjs/common'
import { StoreControllersModule } from './controllers/store/store-controllers.module'
import { CouponControllersModule } from './controllers/coupon/coupon-controllers.module'

@Module({
  imports: [StoreControllersModule, CouponControllersModule],
})
export class HttpModule {}
