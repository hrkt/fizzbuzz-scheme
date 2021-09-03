'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber, FsUndefined } from '../src/sexp.js'

test('evaluating (if #t 1 2) yields 1', () => {
  const code = '(if #t 1 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})

test('evaluating (if #f 1 2) yields 2', () => {
  const code = '(if #f 1 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(2))
})

test('evaluating (if #f 1) yields UNDEFINED', () => {
  const code = '(if #f 1)'
  expect(new FBS().eval(code)).toStrictEqual(FsUndefined.UNDEFINED)
})
