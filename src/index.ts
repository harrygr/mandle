import ucwords from './utils/ucwords'

type Rule = (val: any) => boolean

interface Rules {
  required: Rule
}

type RuleSet = Record<keyof Rules, any>

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

const _rules = {
  required: function (val: any) {
    if (val === undefined || val === null) {
      return false;
    }

    return String(val).replace(/\s/g, "").length > 0
  },
}

const _messages: Record<keyof Rules, (field: string) => string> = {
  required: (field) => `${ucwords(field)} is required`,
}

function getErrors(fieldName: string, value: any, rules: RuleSet) {
  return Object.keys(rules).reduce<string[]>((prev, rule) => {
    return _rules[rule](value) ? prev : prev.concat(_messages[rule](fieldName))
  }, [])
}

export default validate
