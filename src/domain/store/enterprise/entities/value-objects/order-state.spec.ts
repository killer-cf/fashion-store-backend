import { OrderState, State } from './order-state'

test('should be able to create a new Order state from test data', () => {
  const orderItem = new OrderState('PENDING' as State)

  expect(orderItem.toString()).toEqual('PENDING')
})

test('should not be able to create a new invalid Order state', () => {
  expect(() => new OrderState('PE' as State)).Throw()
})
