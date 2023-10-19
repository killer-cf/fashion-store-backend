import { Module } from '@nestjs/common'
import { DayJsValidator } from './dayjs/dayjs-validator'
import { DateValidator } from '@/domain/coupon/application/support/date-validator'

@Module({
  providers: [
    {
      provide: DateValidator,
      useClass: DayJsValidator,
    },
  ],
  exports: [DateValidator],
})
export class DateValidationModule {}
