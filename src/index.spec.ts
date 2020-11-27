import { makeValidator } from './'

const equals = <T>(req: T, val: T) =>
  val !== req ? 'Should be equal' : undefined
const required = <T>(val: T) => (val ? undefined : 'Required')
const atLeast18 = (val: number) => (val >= 18 ? undefined : 'Not old enough')

interface AgeFields {
  age: number | undefined
}

describe('Basic validator usage', () => {
  it('validates a number', () => {
    const validateAge = makeValidator<AgeFields>({ age: [atLeast18] })

    expect(
      validateAge({
        age: 16,
      }),
    ).toEqual({ age: 'Not old enough' })
    expect(
      validateAge({
        age: 44,
      }),
    ).toEqual({})
  })

  it('only returns a message for the first failing constraint for a field', () => {
    const ageValidator = makeValidator<AgeFields>({
      age: [required, atLeast18],
    })

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
    const validatePasswords = (val: any, fields: PasswordFields) =>
      equals(fields.passwordConfirm, val)

    const passwordValidator = makeValidator({
      password: [required, validatePasswords],
    })

    const result = passwordValidator({
      password: 'foo',
      passwordConfirm: 'bar',
    })

    expect(result).toEqual({ password: 'Should be equal' })
  })

  interface PersonFields {
    name: string
    age: string
  }

  it('does not include the keys of passing fields in the validation result', () => {
    const validatePerson = makeValidator({
      name: [required],
      age: [required],
    })

    const fields: PersonFields = {
      name: 'Tim',
      age: '',
    }

    const result = validatePerson(fields)

    expect(result).not.toHaveProperty('name')
  })

  it('allows any data to be validated', () => {
    const validatePerson = makeValidator({
      name: [required],
      age: [required],
    })

    const notAPerson = {
      colour: 'brown',
      legs: 4,
    }

    const result = validatePerson(notAPerson)

    expect(result).toEqual({ name: 'Required', age: 'Required' })
  })
})
