'use strict'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (abs 1) yields 1', () => {
  const code = '(abs 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})

test('evaluating (abs -1) yields 1', () => {
  const code = '(abs -1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})
