import { DateValidator } from '@/domain/coupon/application/support/date-validator'
import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

@Injectable()
export class DayJsValidator implements DateValidator {
  isExpired(date: Date) {
    dayjs.locale('pt-br')
    const today = dayjs().endOf('day')
    const expireDate = dayjs(date).endOf('day')
    return expireDate.isBefore(today)
  }
}
