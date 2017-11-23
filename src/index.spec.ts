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

    const result = validate(rules, data)

    expect(result.name.passes).toBe(true)
    expect(result.place.passes).toBe(false)
    expect(result.place.errors).toHaveLength(1)
    expect(result.place.errors[0]).toEqual('Place is required')
  })

  it("validates the size of something that's big enough", () => {
    const data = { age: 27 }
    const rules = { age: { min: 18 } }

    const result = validate(rules, data)
    expect(result.age.passes).toBe(true)
  })

  it("validates the size of something that's too small", () => {
    const data = { age: 16 }
    const rules = { age: { min: 18 } }

    const result = validate(rules, data)
    expect(result.age.passes).toBe(false)
    expect(result.age.errors[0]).toBe('Age must be greater than 18')
  })
})

describe('Adding custom rules', () => {
  const rules = {
    isAwesome: (_val, req) => req,
  }
  const validate = makeValidator({ rules })

  const data = {
    age: 21,
    name: 'Bob',
  }
  it('allows custom rules to be added', () => {
    const result = validate(
      {
        age: { required: true },
        name: { isAwesome: true },
      },
      data,
    )

    expect(result.name.passes).toBe(true)
  })

  it('works when a custom rule fails', () => {
    const result = validate(
      {
        age: { required: true },
        name: { isAwesome: false },
      },
      data,
    )

    expect(result.name.passes).toBe(false)
    expect(result.name.errors[0]).toContain('"Name" failed')
  })
})

describe('Adding custom messages', () => {
  it('allows setting a message for a custom rule', () => {
    const validate = makeValidator({
      rules: {
        containsWord: (val: string, word: string) => val.indexOf(word) > -1,
      },
      messages: {
        containsWord: (field, word) =>
          `${field} must contain the word "${word}"!`,
      },
    })

    const result = validate(
      { description: { containsWord: 'foo' } },
      { description: 'hello, bar' },
    )
    expect(result.description.errors).toContain(
      'Description must contain the word "foo"!',
    )
  })

  it('allows overriding a default message', () => {
    const validate = makeValidator({
      rules: {},
      messages: {
        required: (field, req) => `${field} must be provided yo!`,
      },
    })

    const result = validate({ name: { required: true } }, { name: '' })
    expect(result.name.errors).toContain('Name must be provided yo!')
  })
})
