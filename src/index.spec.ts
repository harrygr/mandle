import makeValidator, { RuleSet, Messages } from './index'
import { Rule } from './rules'

describe('Basic validator usage', () => {

  const validate = makeValidator()

  it('validates for existance', () => {
    const data = {
      name: 'Joe Bloggs',
      place: '',
    }

    const rules = {
      name: { required: true },
      place: { required: true },
    }

    const result = validate(data, rules)

    expect(result.name.passes).toBe(true)
    expect(result.place.passes).toBe(false)
    expect(result.place.errors).toHaveLength(1)
    expect(result.place.errors[0]).toEqual('Place is required')
  })

  it('validates the size of something that\'s big enough', () => {
    const data = { age: 27 }
    const rules = { age: { min: 18 } }

    const result = validate(data, rules)
    expect(result.age.passes).toBe(true)
  })
  it('validates the size of something that\'s too small', () => {
    const data = { age: 16 }
    const rules = { age: { min: 18 } }

    const result = validate(data, rules)
    expect(result.age.passes).toBe(false)
    expect(result.age.errors[0]).toBe('Age must be greater than 18')
  })
})

interface CustomRules {
  isAwesome: Rule<boolean>
}

describe('Adding custom rules', () => {
  const rules: CustomRules = {
    isAwesome: (_val, req) => req,
  }
  const validate = makeValidator<CustomRules>({ rules })

  const data = {
    age: 21,
    name: 'Bob',
  }
  it('allows custom rules to be added', () => {
    const result = validate(data, {
      age: { required: true },
      name: { isAwesome: true },
    })

    expect(result.name.passes).toBe(true)
  })

  it('works when a custom rule fails', () => {
    const result = validate(data, {
      age: { required: true },
      name: { isAwesome: false },
    })

    expect(result.name.passes).toBe(false)
    expect(result.name.errors[0]).toContain('"Name" failed')
  })
})

interface CustomRules2 { }

describe('Adding custom messages', () => {
  it('allows overriding a default message', () => {
    const messages: Messages<CustomRules2> = {
      required: (field, req) => `${field} must be provided yo!`,
    }

    const validate = makeValidator({ rules: {}, messages })

    const result = validate({ name: '' }, { name: { required: true } })
    expect(result.name.errors).toContain('Name must be provided yo!')
  })
})