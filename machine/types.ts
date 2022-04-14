type ExternalOrder = {
  id: string
  rsu: string
  productName: string
}

export type Context = {
  stock?: string[]
  customerData?: Record<string, string | number>
  customerRequest?: string
}

export type Events =
  | { type: 'CUSTOMER_REQUEST'; customerRequest: string }
  | { type: 'HAS_AVAILABLE' }
  | { type: 'NOT_AVAILABLE' }

export type Services = {
  orderExternal: {
    data: ExternalOrder
  }
}
