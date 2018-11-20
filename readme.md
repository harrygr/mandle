# Mandle

[![CircleCI](https://img.shields.io/circleci/project/github/harrygr/mandle.svg?style=flat-square)](https://circleci.com/gh/harrygr/mandle) [![npm](https://img.shields.io/npm/v/mandle.svg?style=flat-square)](https://www.npmjs.com/package/mandle) [![codecov](https://codecov.io/gh/harrygr/mandle/branch/master/graph/badge.svg)](https://codecov.io/gh/harrygr/mandle)

Mandle is a functional validation library built in TypeScript. It brings a simple, declarative api for validating your data.

It's tiny in size and has no dependencies.

## Installation

```
yarn add mandle
```

## Example

```typescript
import { makeValidator } from 'mandle'
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
const required = (val: any) => (val ? undefined : 'Required')
```

The data being validated is also provided as the 2nd argument for a constraint for situations where your constaint depends on some other value in the data. E.g.

```typescript
const passwordEquals: Constraint<PasswordFields> = (password, fields) =>
  password !== fields.passwordConfirm ? 'Passwords should match' : undefined
```
