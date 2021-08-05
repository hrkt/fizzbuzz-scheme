'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

export function expse (code, obj) {
  expect(new FBS().eval(code)).toStrictEqual(obj)
}
