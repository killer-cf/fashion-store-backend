import { DateValidator } from '@/domain/coupon/application/support/date-validator'

export class FakeDateValidator implements DateValidator {
  isExpired(date: Date): boolean {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    return date < currentDate
  }
}
