import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'
import { interpret, assign } from 'xstate'
import { machine as originalMachine } from './machine'

const storeRequestCounter = vi.fn()
const orderExternalCounter = vi.fn()
const productContextCounter = vi.fn()
const storeCustomerDataCounter = vi.fn()

const actions = {
  storeRequest: (_context, event) => {
    storeRequestCounter()
    return assign({
      customerRequest: event.customerRequest,
    })
  },
  productToContext: (context, event) => {
    productContextCounter()
    return assign({
      stock: [...context.stock, event.data.productName],
    })
  },
  storeCustomerData: (_context, event) => {
    storeCustomerDataCounter()
    return assign({
      customerData: event.data,
    })
  },
}

describe('machine happy path', () => {
  const services = {
    orderExternal: () => () => {
      orderExternalCounter()
      return Promise.resolve({
        id: '123',
        rsu: 'hash-rsu-234',
        productName: 'Incredible Product',
      })
    },
  }
  let service
  beforeEach(() => {
    const machine = originalMachine.withConfig({
      services,
      actions,
    })
    service = interpret(machine)
  })

  afterEach(() => {
    service.stop()
  })
  test('idle waits for `CUSTOMER_REQUEST`', () => {
    service.start()
    service.send({
      type: 'CUSTOMER_REQUEST',
      customerRequest: 'test',
    })

    assert(service.state.matches('check-floor'))
  })

  test('when `CUSTOMER_REQUEST` fires, `storeRequestCounter()` must be triggered', () => {
    service.start()
    service.send({
      type: 'CUSTOMER_REQUEST',
      customerRequest: 'test',
    })

    expect(storeRequestCounter).toBeCalledTimes(1)
    // expect(storeRequestCounter).toHaveBeenCalled()
  })

  test('when `HAS_AVAILABLE` fires, goes to "deliver"', () => {
    service.start('check-floor')

    service.send({
      type: 'HAS_AVAILABLE',
    })

    assert(service.state.matches('deliver'))
  })

  test('when `NOT_AVAILABLE` fires, goes to "order-online"', () => {
    service.start('check-floor')
    service.send({
      type: 'NOT_AVAILABLE',
    })

    assert(service.state.matches('order-online'))
  })

  test('should order and store customer data when product not in stock', async (done) => {
    service.start('check-floor')
    service.onTransition((state) => {
      if (state.matches('stock-product')) {
        expect(orderExternalCounter).toBeCalledTimes(1)
        expect(productContextCounter).toBeCalledTimes(1)
        expect(storeCustomerDataCounter).toBeCalledTimes(1)
      }

      if (state.matches('idle')) {
        done()
      }
    })

    service.send({
      type: 'NOT_AVAILABLE',
    })
  })
})

describe('machine failsafe', () => {
  let service
  const services = {
    orderExternal: () => () => {
      orderExternalCounter()
      throw new Error()
    },
  }
  beforeEach(() => {
    const machine = originalMachine.withConfig({
      services,
      actions,
    })
    service = interpret(machine)
  })

  afterEach(() => {
    service.stop()
  })

  test('when `onError` fires from `orderExternal`, goes to "product-unavailable"', () => {
    service.start('check-floor')
    service.send({
      type: 'NOT_AVAILABLE',
    })

    assert(service.state.matches('product-unavailable'))
  })

  test('after 2000ms, "product-unavailable" should go back to "idle"', async (done) => {
    service.onTransition((state) => {
      console.log(state.value)
      if (state.matches('idle')) {
        done()
      }
    })

    service.start('check-floor')

    service.send({
      type: 'NOT_AVAILABLE',
    })
  })
})
