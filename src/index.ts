import ucwords from './utils/ucwords'
import _rules, { Rules } from './rules'

export type RuleSet = Partial<Record<keyof Rules, any>>

interface ValidationResult {
  errors: string[]
  passes: boolean
}

type Result<D> = Record<keyof D, ValidationResult>

function validate<D>(data: D, rules: Record<keyof D, RuleSet>) {
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

type Message<T> = (field: string, req: T) => string

const _messages: Record<keyof Rules, (field: string, req: any) => string> = {
  required: (field) => `${ucwords(field)} is required`,
  min: (field, min) => `${ucwords(field)} must be greater than ${min}`,
  max: (field, max) => `${ucwords(field)} is be smaller than ${max}`,
}

function getErrors(fieldName: string, value: any, rules: RuleSet) {
  return Object.keys(rules).reduce<string[]>((prev, rule) => {
    return _rules[rule](value, rules[rule])
      ? prev
      : prev.concat(_messages[rule](fieldName, rules[rule]))
  }, [])
}

export default validate
