# Shop-Machine 🛍

this is a contrived example on creating and testing a State Machine.
We’re using a physical shop as an example case.

![Shop Machine on Stately Viz ](https://prodstack-ogimagebuckete7b3c4ce-y1z85p85b26y.s3.amazonaws.com/71ec8a5b-d82d-46e5-9e7e-2b8ee0d7f2a7.png)

## Tips 🍪

- **States**: the checkpoint of the machine
- **Events**: things that happen to move from one state to another
- **Actions**: one-off executions, no side-effects to the machine
- **Guards**: conditions that determine which state to transition towards
- **Services**: asynchronous APIs that will affect the machine’s behaviour

## Video tutorial 📹

> Publishing Wednesday: Wednesday, 2022.04.20 on [AtilaIO](https://atila.io/youtube)

## Stack 🔩

| Dependencies               | Why                                      |
| -------------------------- | ---------------------------------------- |
| XState                     | orchestrate and handle the state machine |
| Vitest                     | to run the behavioral/unit tests         |
| TypeScript                 | for the type system                      |
| Stately VSCode extension\* | for types generation                     |

> 💡 you can replace the VSCode extension with the Stately CLI if you prefer
