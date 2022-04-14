// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    storeRequest: "CUSTOMER_REQUEST";
    storeCustomerData: "done.invoke.shop.order-online:invocation[0]";
    productToContext: "done.invoke.shop.order-online:invocation[0]";
  };
  internalEvents: {
    "done.invoke.shop.order-online:invocation[0]": {
      type: "done.invoke.shop.order-online:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.shop.order-online:invocation[0]": {
      type: "error.platform.shop.order-online:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    orderExternal: "done.invoke.shop.order-online:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    orderExternal: "NOT_AVAILABLE";
  };
  eventsCausingGuards: {
    hasInStock: "NOT_AVAILABLE";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "idle"
    | "check-floor"
    | "order-online"
    | "stock-product"
    | "deliver"
    | "product-unavailable";
  tags: never;
}
