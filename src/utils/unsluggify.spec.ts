import unsluggify from './unsluggify'

it('Unsluggifies a single word', () => {
  expect(unsluggify('hello')).toBe('Hello')
})

it('Unsluggifies a multiple words', () => {
  expect(unsluggify('hello world')).toBe('Hello World')
})

it('Unsluggifies a camelCase slug', () => {
  expect(unsluggify('helloWorldAgain')).toBe('Hello World Again')
})

it('Unsluggifies a snake_case slug', () => {
  expect(unsluggify('hello_world_again')).toBe('Hello World Again')
})