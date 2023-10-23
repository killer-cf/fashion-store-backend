import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderCreated } from '@/domain/coupon/application/subscribers/on-order-created'
import { ValidateCouponUseCase } from '@/domain/coupon/application/use-cases/validate-coupon'
import { DateValidationModule } from '../date-validation/date-validation.module'

@Module({
  imports: [DatabaseModule, DateValidationModule],
  providers: [OnOrderCreated, ValidateCouponUseCase],
})
export class EventsModule {}
