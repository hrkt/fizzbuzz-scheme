'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (mod 3 3) yields 0', () => {
  const code = '(mod 3 3)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(0))
})

test('evaluating (mod 3 1) yields 0', () => {
  const code = '(mod 3 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(0))
})

test('evaluating (mod 3 2) yields 1', () => {
  const code = '(mod 3 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})
