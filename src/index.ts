import ucwords from './utils/ucwords'
import defaultRules, { DefaultRules, Rule } from './rules'

export type RuleSet<R> = Partial<Record<keyof DefaultRules | keyof R, any>>

interface ValidationResult {
  errors: string[]
  passes: boolean
}

type Result<D> = Record<keyof D, ValidationResult>

interface Options<R> {
  rules?: R
}

export default function makeValidator<R>(options: Options<R> = {}) {
  const combinedRules = Object.assign({}, defaultRules, options.rules)

  const _messages: Record<keyof DefaultRules, (field: string, req: any) => string> = {
    required: (field) => `${ucwords(field)} is required`,
    min: (field, min) => `${ucwords(field)} must be greater than ${min}`,
    max: (field, max) => `${ucwords(field)} is be smaller than ${max}`,
  }

  function getErrors(fieldName: string, value: any, rules: RuleSet<R>) {
    return Object.keys(rules).reduce<string[]>((prev, rule) => {
      if (combinedRules[rule](value, rules[rule])) {
        return prev
      }
      const message = _messages[rule]
        ? _messages[rule](fieldName, rules[rule])
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