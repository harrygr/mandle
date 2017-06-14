# Mandle

Mandle is functional validation library built in TypeScript. It brings a simple, typesafe api for validating your data.

## Example

```typescript
import * as mandle from 'mandle'

// Make a validator instance
const validate = mandle()

// Validate some data

const result = validate({
  name: 'Foo Fooson',
  age: 16,
}, {
  name: {required: true},
  age: {required: true, min: 18},
})

// result:
// {
//   name: {
//     passes: true,
//     errors: [],
//   },
//   age: {
//     passes: false,
//     errors: "Age must be greater than 18",
//   }
// }
```
