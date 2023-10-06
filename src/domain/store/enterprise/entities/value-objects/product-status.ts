export enum Status {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export class ProductStatus {
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

  public equals(otherStatus: ProductStatus): boolean {
    return this.value === otherStatus.getValue()
  }

  public isActive(): boolean {
    return this.value === Status.ACTIVE
  }

  public isDisabled(): boolean {
    return this.value === Status.DISABLED
  }

  static create(status: 'ACTIVE' | 'DISABLED'): ProductStatus {
    const mappedStatus = status === 'ACTIVE' ? Status.ACTIVE : Status.DISABLED
    if (!Object.values(Status).includes(mappedStatus)) {
      throw new Error('Status inválido')
    }
    return new ProductStatus(mappedStatus)
  }
}
