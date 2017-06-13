import validate, { RuleSet } from './index'

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