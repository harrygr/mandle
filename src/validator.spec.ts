import { validate, Constraint } from './validator'

function equals<T>(req: T, val: T) {
  return val !== req ? 'Should be equal' : undefined
}

interface PasswordFields {
  password: string
  passwordConfirm: string
}

describe('New Validator', () => {
  it('validates a password and confirmation', () => {
    const passwordEquals: Constraint<keyof PasswordFields> = (val, fields) =>
      equals(fields.passwordConfirm, val)

    const passwordValidator = validate({
      password: [passwordEquals],
    })

    const result = passwordValidator({
      password: 'foo',
      passwordConfirm: 'bar',
    })

    console.log(result)
  })
})
