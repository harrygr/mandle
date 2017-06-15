# Mandle

[![Build Status](https://semaphoreci.com/api/v1/harrygr/mandle/branches/master/badge.svg)](https://semaphoreci.com/harrygr/mandle)


Mandle is functional validation library built in TypeScript. It brings a simple, typesafe api for validating your data.

## Example

```typescript
import mandle from 'mandle'

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

// {
//   name: {
//     passes: true,
//     errors: [],
//   },
//   age: {
//     passes: false,
//     errors: ["Age must be greater than 18"],
//   }
// }
```

## Included Rules

- `required: boolean`: Ensure the value is not empty, whitespace only, undefined or null.
- `min: number`: Ensures numbers are `min` or greater, arrays have `min` or more elements and strings have at least `min` characters.
- `max: number`: The inverse of `min`

## Add Custom Rules

You can pass your own rules to mandle when you obtain a validator instance.

A rule is a function that takes the value to be validated, and potentially a requirement to compare against and returns a boolean.

E.g.

```typescript
import mandle from 'mandle'

// Make a validator instance
const validate = mandle({
  isInArray (val, arr) {
    return arr.indexOf(val) > -1
  }
})

const result = validate({
  animal: 'cat',
}, {
  animal: {isInArray: ['cat', 'dog', 'horse']}
})

// {
//   animal: {
//     passes: true,
//     errors: [],
//   }
// }
```