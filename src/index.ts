import unsluggify from './utils/unsluggify'
import defaultRules, { DefaultRules, Rule } from './rules'

export interface DefaultMessages {
  required: (req: boolean) => string
  min: (min: number) => string
  max: (max: number) => string
  equals: (compare: any) => string
}

export type RuleSet<R> = Partial<Record<keyof DefaultRules & keyof R, any>>
export type Messages<R> = Partial<Record<keyof DefaultMessages & keyof R, (fieldName: string, req: any) => string>>

export interface ValidationResult {
  errors: string[]
  passes: boolean
}

export type Result<D> = Record<keyof D, ValidationResult>

export interface Options<R> {
  rules?: R
  messages?: Messages<R>
}

export default function makeValidator<R>(options: Options<R> = {}) {
  const combinedRules = Object.assign({}, defaultRules, options.rules)

  function getErrors(field: string, value: any, rules: RuleSet<R>) {
    const fieldName = unsluggify(field)
    const messages = Object.assign({}, defaultMessages, options.messages || {})

    return Object.keys(rules).reduce<string[]>((prev, rule) => {
      if (combinedRules[rule](value, rules[rule])) {
        return prev
      }
      const message = messages[rule]
        ? messages[rule](fieldName, rules[rule])
        : makeFallbackMessage(fieldName, rule)
      return prev.concat(message)
    }, [])
  }

  return function validate<D>(constraints: Record<keyof D, RuleSet<R>>, data: D) {
    return Object.keys(data).reduce((prev, key) => {
      const errors = getErrors(key, data[key], constraints[key])
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

const defaultMessages: Record<keyof DefaultRules, (fieldName: string, req: any) => string> = {
  required: (fieldName, req) => `${fieldName} is required`,
  min: (fieldName, min) => `${fieldName} must be greater than ${min}`,
  max: (fieldName, max) => `${fieldName} must be smaller than ${max}`,
  equals: (fieldName, compare) => `${fieldName} does not match`,
}
