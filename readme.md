# Mandle

[![Build Status](https://semaphoreci.com/api/v1/harrygr/mandle/branches/master/badge.svg)](https://semaphoreci.com/harrygr/mandle) [![npm version](https://badge.fury.io/js/mandle.svg)](https://badge.fury.io/js/mandle)

Mandle is a functional validation library built in TypeScript. It brings a simple, typesafe api for validating your data.

## Installation

```
yarn add mandle
```

## Example

```typescript
import makeValidator from 'mandle'
import { required, atLeast18 } from './constraints'

// Make a validator instance
const validatePerson = makeValidator({
  name: [required],
  age: [required, atLeast18],
})

// Validate some data
const result = validatePerson(
  {
    name: 'Foo Fooson',
    age: 16,
  },
)

// {
//   age: "Must be at least 18"
// }
```

## Constraints

To construct a validator you should give it some constraints. A constraint is a function that takes a value and returns either a string (the validation error message) or `undefined`.

For example, one of the simplest constraints you might want is `required`:

```typescript
const required = <T>(val: T) => (val ? undefined : 'Required')
```

The data being validated is also provided as the 2nd argument for a constraint for situations where your constaint depends on some other value in the data. E.g.

```typescript
const passwordEquals: Constraint<PasswordFields> = (password, fields) =>
  password !== fields.passwordConfirm ? 'Passwords should match' : undefined
```
