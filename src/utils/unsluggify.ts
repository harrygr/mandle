import snakeCase = require('lodash/snakeCase')
import upperFirst = require('lodash/upperFirst')

export default function unslugglify(slug: string) {
  return snakeCase(slug)
    .split('_')
    .map(upperFirst)
    .join(' ')
}