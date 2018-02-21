import makeValidator, { RuleSet, Messages } from './index'
import { Rule } from './rules'

describe('Basic validator usage', () => {
  const validate = makeValidator()

  it('consolidates the validation result when 2 fields fail', () => {
    const data = {
      size1: 10,
      size2: 13,
    }

    const rules = {
      size1: { min: 20 },
      size2: { min: 20 },
    }

    const result = validate(rules, data)
    expect(result.passes).toBe(false)
    expect(result.errors).toHaveLength(2)
    expect(result.errors).toContain('Size 2 must be greater than 20')
  })

  it('consolidates the validation result when 1 field fails', () => {
    const data = {
      size1: 10,
      size2: 30,
    }

    const rules = {
      size1: { min: 20 },
      size2: { min: 20 },
    }

    const result = validate(rules, data)
    expect(result.passes).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors).toContain('Size 1 must be greater than 20')
  })

  it('consolidates the validation result when no fields fail', () => {
    const data = {
      size1: 40,
      size2: 30,
    }

    const rules = {
      size1: { min: 20 },
      size2: { min: 20 },
    }

    const result = validate(rules, data)
    expect(result.passes).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

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

    expect(result.fields.name.passes).toBe(true)
    expect(result.fields.place.passes).toBe(false)
    expect(result.fields.place.errors).toHaveLength(1)
    expect(result.fields.place.errors[0]).toEqual('Place is required')
  })

  it("validates the size of something that's big enough", () => {
    const data = { age: 27 }
    const rules = { age: { min: 18 } }

    const result = validate(rules, data)
    expect(result.fields.age.passes).toBe(true)
  })

  it("validates the size of something that's too small", () => {
    const data = { age: 16 }
    const rules = { age: { min: 18 } }

    const result = validate(rules, data)
    expect(result.fields.age.passes).toBe(false)
    expect(result.fields.age.errors[0]).toBe('Age must be greater than 18')
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

    expect(result.fields.name.passes).toBe(true)
  })

  it('works when a custom rule fails', () => {
    const result = validate(
      {
        age: { required: true },
        name: { isAwesome: false },
      },
      data,
    )

    expect(result.fields.name.passes).toBe(false)
    expect(result.fields.name.errors[0]).toContain('"Name" failed')
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
    expect(result.fields.description.errors).toContain(
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
    expect(result.fields.name.errors).toContain('Name must be provided yo!')
  })

  it('allows adding a custom message for a specific field', () => {
    const validate = makeValidator({
      messages: { min: () => 'Too short' },
    })

    const result = validate(
      {
        name: { min: 10 },
        faveAnimal: { min: 5 },
      },
      {
        name: 'Bobby',
        faveAnimal: 'Cat',
      },
      {
        faveAnimal: {
          min: (field, req) => `Fave animal short be at least ${req} chars`,
        },
      },
    )

    expect(result.fields.name.errors).toContain('Too short')
    expect(result.fields.faveAnimal.errors).toContain(
      'Fave animal short be at least 5 chars',
    )
  })
})
