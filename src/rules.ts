import isEqual = require('lodash/isEqual')

export type Rule<T> = (val: any, req: T) => boolean

export interface DefaultRules {
  required: Rule<boolean>
  equals: Rule<any>
  min: Rule<number>
  max: Rule<number>
}

export function required(val: any, req: boolean = true) {
  if (!req) {
    return true
  }

  if (val === undefined || val === null) {
    return false;
  }

  return String(val).replace(/\s/g, "").length > 0
}

export function equals(val: any, compare: any) {
  return isEqual(val, compare)
}

export function min(val: any, req: number) {
  return getSize(val) >= req
}

export function max(val: any, req: number) {
  return getSize(val) <= req
}

const rules: DefaultRules = { required, equals, min, max }

export default rules

function getSize(val: any) {
  if (val instanceof Array) {
    return val.length
  }

  if (typeof val === 'number') {
    return val
  }

  return val.length
}
