import unsluggify from './utils/unsluggify'
import defaultRules, { DefaultRules, Rule } from './rules'

export type RuleSet<R> = Partial<Record<keyof DefaultRules | keyof R, any>>

export interface ValidationResult {
  errors: string[]
  passes: boolean
}

export type Result<D> = Record<keyof D, ValidationResult>

export interface Options<R> {
  rules?: R
}

export default function makeValidator<R>(options: Options<R> = {}) {
  const combinedRules = Object.assign({}, defaultRules, options.rules)

  function getErrors(fieldName: string, value: any, rules: RuleSet<R>) {
    const _messages = getDefaultMessages(fieldName)
    return Object.keys(rules).reduce<string[]>((prev, rule) => {
      if (combinedRules[rule](value, rules[rule])) {
        return prev
      }
      const message = _messages[rule]
        ? _messages[rule](rules[rule])
        : makeFallbackMessage(fieldName, rule)
      return prev.concat(message)
    }, [])
  }

  return function validate<D>(data: D, rules: Record<keyof D, RuleSet<R>>) {
    return Object.keys(data).reduce((prev, key) => {
      const errors = getErrors(key, data[key], rules[key])
      return {
        ...prev,
        [key]: {
          errors,
          passes: !errors.length
        }
      }
    }, {}) as Result<D>
  }
}

function makeFallbackMessage(fieldName: string, ruleName: string) {
  return `"${fieldName}" failed the "${ruleName}" check`
}

const getDefaultMessages = (field: string): Record<keyof DefaultRules, (req: any) => string> => {
  const fieldName = unsluggify(field)
  return {
    required: (req) => `${fieldName} is required`,
    min: (min) => `${fieldName} must be greater than ${min}`,
    max: (max) => `${fieldName} must be smaller than ${max}`,
    equals: (compare) => `${fieldName} does not match`,
  }
}