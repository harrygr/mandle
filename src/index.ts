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

export interface Result<D> {
  fields: Record<keyof D, ValidationResult>
  errors: string[]
  passes: boolean
}

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
    fieldConstraints: RuleSet<R>,
    messageOverrides: Messages<R>,
  ) {
    const fieldName = unsluggify(field)
    const combinedMessages = {
      ...messages,
      ...((messageOverrides as {}) || {}),
    }

    return Object.keys(fieldConstraints).reduce<string[]>(
      (prev, constraint) => {
        if (combinedRules[constraint](value, fieldConstraints[constraint])) {
          return prev
        }
        const message = combinedMessages[constraint]
          ? combinedMessages[constraint](
              fieldName,
              fieldConstraints[constraint],
            )
          : makeFallbackMessage(fieldName, constraint)
        return prev.concat(message)
      },
      [],
    )
  }

  return function validate<D>(
    constraints: Record<keyof D, RuleSet<R>>,
    data: D,
    messages: Partial<Record<keyof D, Messages<R>>> = {},
  ) {
    const fields = Object.keys(data).reduce(
      (prev, field) => {
        const messageOverrides = messages[field] || {}
        const errors = getErrors(
          field,
          data[field],
          constraints[field] || {},
          messageOverrides,
        )
        const fieldPasses = !errors.length
        return {
          ...prev,
          errors: prev.errors.concat(errors),
          passes: prev.passes ? fieldPasses : prev.passes,
          fields: {
            ...prev.fields,
            [field]: {
              errors,
              passes: fieldPasses,
            },
          },
        }
      },
      { fields: {}, passes: true, errors: [] as string[] },
    )

    return fields as Result<D>
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
