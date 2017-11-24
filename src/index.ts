import unsluggify from './utils/unsluggify'
import defaultRules, { DefaultRules, Rule } from './rules'

export type RuleSet<R> = Partial<Record<keyof DefaultRules | keyof R, any>>

export type MessageFunc = (fieldName: string, req: any) => string
export type DefaultMessages = Record<keyof DefaultRules, MessageFunc>
export type Messages<R> = Partial<
  Record<keyof R | keyof DefaultRules, MessageFunc>
>

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
  const combinedRules = { ...defaultRules, ...(options.rules || {}) }
  const messages = { ...defaultMessages, ...((options.messages as {}) || {}) }

  function getErrors(
    field: string,
    value: any,
    rules: RuleSet<R>,
    messageOverrides: Messages<R>,
  ) {
    const fieldName = unsluggify(field)
    const combinedMessages = {
      ...messages,
      ...((messageOverrides as {}) || {}),
    }

    return Object.keys(rules).reduce<string[]>((prev, rule) => {
      if (combinedRules[rule](value, rules[rule])) {
        return prev
      }
      const message = combinedMessages[rule]
        ? combinedMessages[rule](fieldName, rules[rule])
        : makeFallbackMessage(fieldName, rule)
      return prev.concat(message)
    }, [])
  }

  return function validate<D>(
    constraints: Record<keyof D, RuleSet<R>>,
    data: D,
    messages: Partial<Record<keyof D, Messages<R>>> = {},
  ) {
    return Object.keys(data).reduce((prev, field) => {
      const messageOverrides = messages[field] || {}
      const errors = getErrors(
        field,
        data[field],
        constraints[field],
        messageOverrides,
      )
      return {
        ...prev,
        [field]: {
          errors,
          passes: !errors.length,
        },
      }
    }, {}) as Result<D>
  }
}

function makeFallbackMessage(fieldName: string, ruleName: string) {
  return `"${fieldName}" failed the "${ruleName}" check`
}

const defaultMessages: DefaultMessages = {
  required: (fieldName, req) => `${fieldName} is required`,
  min: (fieldName, min) => `${fieldName} must be greater than ${min}`,
  max: (fieldName, max) => `${fieldName} must be smaller than ${max}`,
  equals: (fieldName, compare) => `${fieldName} does not match`,
}
