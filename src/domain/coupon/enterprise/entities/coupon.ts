import { Entity } from '@/core/entities/entity'
import { CouponStatus, Status } from './value-objects/coupon-status'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CouponProps {
  code: string
  status: CouponStatus
  description: string
  discount: number
  discountType: 'percentage' | 'amount'
  maxDiscount: number
  minValue: number
  quantity: number
  expiresAt: Date
  updatedAt?: Date | null
  createdAt: Date
}

export class Coupon extends Entity<CouponProps> {
  get code() {
    return this.props.code
  }

  get status() {
    return this.props.status
  }

  get description() {
    return this.props.description
  }

  get discount() {
    return this.props.discount
  }

  get discountType() {
    return this.props.discountType
  }

  get maxDiscount() {
    return this.props.maxDiscount
  }

  get minValue() {
    return this.props.minValue
  }

  get quantity() {
    return this.props.quantity
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public finalDiscount(value: number) {
    if (this.props.discountType === 'amount') {
      return this.props.discount
    }

    const discount = (this.props.discount / 100) * value
    const finalDiscount =
      discount > this.props.maxDiscount ? this.props.maxDiscount : discount

    return finalDiscount
  }

  public activate() {
    this.props.status = new CouponStatus(Status.ACTIVE)
  }

  public disable() {
    this.props.status = new CouponStatus(Status.DISABLED)
  }

  public isActive(): boolean {
    return this.props.status.getValue() === Status.ACTIVE
  }

  public isDisabled(): boolean {
    return this.props.status.getValue() === Status.DISABLED
  }

  public use(): void {
    this.props.quantity -= 1
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CouponProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const coupon = new Coupon(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return coupon
  }
}
