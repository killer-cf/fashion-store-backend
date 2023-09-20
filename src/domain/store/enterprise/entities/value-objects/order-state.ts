export enum State {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RECUSED = 'RECUSED',
  CANCELED = 'CANCELED',
  SENT = 'SENT',
  FINISHED = 'FINISHED',
}

export class OrderState {
  private value: State

  constructor(value: State) {
    if (!Object.values(State).includes(value)) {
      throw new Error(`Invalid order state: ${value}`)
    }
    this.value = value
  }

  public getValue(): State {
    return this.value
  }

  public toString(): string {
    return this.value
  }

  public equals(otherState: OrderState): boolean {
    return this.value === otherState.getValue()
  }

  public isPending(): boolean {
    return this.value === State.PENDING
  }

  public isApproved(): boolean {
    return this.value === State.APPROVED
  }

  public isRecused(): boolean {
    return this.value === State.RECUSED
  }

  public isCanceled(): boolean {
    return this.value === State.CANCELED
  }

  public isSent(): boolean {
    return this.value === State.SENT
  }

  public isFinished(): boolean {
    return this.value === State.FINISHED
  }
}
