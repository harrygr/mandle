export type Rule<D extends object> = (val: any, fields: D) => string | undefined

export type RuleSet<R extends object, D extends object> = Record<
  keyof R,
  Rule<D>[]
>

export const makeValidator = <D extends object, R extends object = Partial<D>>(
  ruleSet: RuleSet<R, D>,
) => {
  const fieldnamesToValidate = Object.keys(ruleSet)

  return (data: D) => {
    return fieldnamesToValidate.reduce((acc, field) => {
      const rules = ruleSet[field] as Rule<D>[]

      const valueToValidate = data[field]

      const error = rules.reduce(
        (err, v) => (err ? err : v(valueToValidate, data)),
        undefined,
      )

      return error ? { ...acc, [field]: error } : acc
    }, {} as Record<keyof R, string>)
  }
}
