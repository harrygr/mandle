import { makeValidator, Constraint } from './'

const equals = <T>(req: T, val: T) =>
  val !== req ? 'Should be equal' : undefined
const required = <T>(val: T) => (val ? undefined : 'Required')
const atLeast18 = (val: number) => (val >= 18 ? undefined : 'Not old enough')

describe('Basic validator usage', () => {
  it('validates a number', () => {
    const ageValidator = makeValidator({ age: [atLeast18] })

    expect(
      ageValidator({
        age: 16,
      }),
    ).toEqual({ age: 'Not old enough' })
    expect(
      ageValidator({
        age: 44,
      }),
    ).toEqual({})
  })

  it('only returns a message for the first failing constraint for a field', () => {
    const ageValidator = makeValidator({ age: [required, atLeast18] })

    expect(
      ageValidator({
        age: undefined,
      }),
    ).toEqual({ age: 'Required' })
  })

  interface PasswordFields {
    password: string
    passwordConfirm: string
  }

  it('validates a field being equal to another', () => {
    const passwordEquals: Constraint<PasswordFields> = (val, fields) =>
      equals(fields.passwordConfirm, val)

    const passwordValidator = makeValidator<PasswordFields>({
      password: [required, passwordEquals],
    })

    const result = passwordValidator({
      password: 'foo',
      passwordConfirm: 'bar',
    })

    expect(result).toEqual({ password: 'Should be equal' })
  })

  it('does not include the keys of passing fields in the validation result', () => {
    const personValidator = makeValidator({
      name: [required],
      age: [required],
    })

    const fields = {
      name: 'Tim',
      age: undefined,
    }

    const result = personValidator(fields)

    expect(result).not.toHaveProperty('name')
  })
})
