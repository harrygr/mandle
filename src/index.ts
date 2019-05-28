export type Constraint<F extends object, T = any> = (
  val: T,
  fields: F,
) => string | undefined
export type Constraints<F extends object> = Partial<
  Record<keyof F, Constraint<F>[]>
>
export type ValidationResult<F extends object> = Partial<
  Record<keyof F, string | undefined>
>

export const makeValidator = <F extends object>(
  constraints: Constraints<F>,
) => {
  return (fields: F): ValidationResult<F> => {
    const fieldNames = Object.keys(fields) as (keyof F)[]

    const getErrors = (
      errors: ValidationResult<F>,
      fieldName: keyof F,
    ): ValidationResult<F> => {
      const val = fields[fieldName]
      const fieldConstraints = (constraints[fieldName] || []) as Constraint<
        F,
        typeof val
      >[]

      const error = fieldConstraints.reduce(
        (err, con) => (err ? err : con(val, fields)),
        undefined,
      )

      return error ? { ...errors, [fieldName]: error } : errors
    }

    return fieldNames.reduce(getErrors, {} as ValidationResult<F>)
  }
}
