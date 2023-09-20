export type State =
  | 'PENDING'
  | 'APPROVED'
  | 'RECUSED'
  | 'CANCELED'
  | 'SENT'
  | 'FINISHED'

export class OrderState {
  public value: string

  constructor(value: State) {
    this.value = value
  }
}
