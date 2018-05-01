export type Constraint<F extends string> = (
  val: any,
  fields: Record<F, any>,
) => string | undefined
export type Constraints<F extends string> = Partial<Record<F, Constraint<F>[]>>
export type ValidationResult<F extends string> = Record<F, string | undefined>

export function validate<F extends string>(constraints: Constraints<F>) {
  return (fields: Record<F, any>) => {
    const fieldNames = Object.keys(fields) as F[]

    function getErrors(acc: ValidationResult<F>, fieldName: F) {
      const val = fields[fieldName]
      const fieldConstraints = (constraints[fieldName] || []) as Constraint<F>[]

      const error = fieldConstraints.reduce(
        (err, con) => (err ? err : con(val, fields)),
        undefined,
      )

      return { ...(acc as {}), [fieldName]: error }
    }

    return fieldNames.reduce(getErrors, {} as ValidationResult<F>)
  }
}
