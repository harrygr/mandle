import validate from './index'

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