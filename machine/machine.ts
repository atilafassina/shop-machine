import { createMachine, assign } from 'xstate'
import type { Context, Events, Services } from './types'

export const machine = createMachine(
  {
    context: { stock: [] },
    tsTypes: {} as import('./machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as Services,
    },
    id: 'shop',
    initial: 'idle',
    states: {
      idle: {
        on: {
          CUSTOMER_REQUEST: {
            actions: 'storeRequest',
            target: 'check-floor',
          },
        },
      },
      'check-floor': {
        on: {
          HAS_AVAILABLE: {
            target: 'deliver',
          },
          NOT_AVAILABLE: [
            {
              cond: 'hasInStock',
              target: 'deliver',
            },
            {
              target: 'order-online',
            },
          ],
        },
      },
      'order-online': {
        invoke: {
          src: 'orderExternal',
          onDone: [
            {
              actions: 'storeCustomerData',
              target: 'stock-product',
            },
          ],
          onError: [
            {
              target: 'product-unavailable',
            },
          ],
        },
      },
      'stock-product': {
        entry: 'productToContext',
        after: {
          '3000': {
            target: 'idle',
          },
        },
      },
      deliver: {
        type: 'final',
      },
      'product-unavailable': {
        after: {
          '2000': {
            target: 'idle',
          },
        },
      },
    },
  },
  {
    services: {
      orderExternal: () => () => {
        return Promise.resolve({
          id: '123',
          rsu: 'hash-rsu-234',
          productName: 'Incredible Product',
        })
      },
    },
    actions: {
      storeRequest: assign((_context, event) => ({
        customerRequest: event.customerRequest,
      })),
      storeCustomerData: assign((_context, event) => ({
        customerData: event.data,
      })),
      productToContext: assign((context, event) => ({
        stock: [...context.stock, event.data.productName],
      })),
    },
    guards: {
      hasInStock: (context) => context.stock.includes(context?.customerRequest),
    },
  }
)
