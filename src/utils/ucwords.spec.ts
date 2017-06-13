import ucwords from './ucwords'

it('Capitalises a single word', () => {
  expect(ucwords('hello')).toBe('Hello')
})

it('Capitalises a multiple words', () => {
  expect(ucwords('hello world')).toBe('Hello World')
})