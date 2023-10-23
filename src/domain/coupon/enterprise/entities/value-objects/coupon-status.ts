export enum Status {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export class CouponStatus {
  private value: Status

  constructor(value: Status) {
    this.value = value
  }

  public getValue(): Status {
    return this.value
  }

  public toString(): string {
    return this.value
  }

  public equals(otherStatus: CouponStatus): boolean {
    return this.value === otherStatus.getValue()
  }

  public isActive(): boolean {
    return this.value === Status.ACTIVE
  }

  public isDisabled(): boolean {
    return this.value === Status.DISABLED
  }

  static create(status: 'ACTIVE' | 'DISABLED'): CouponStatus {
    const mappedStatus = status === 'ACTIVE' ? Status.ACTIVE : Status.DISABLED
    if (!Object.values(Status).includes(mappedStatus)) {
      throw new Error('Status inválido')
    }
    return new CouponStatus(mappedStatus)
  }
}
