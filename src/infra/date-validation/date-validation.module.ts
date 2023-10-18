import { Module } from '@nestjs/common'
import { DayJsValidator } from './dayjs/dayjs-validator'

@Module({
  providers: [DayJsValidator],
  exports: [DayJsValidator],
})
export class DateValidationModule {}
