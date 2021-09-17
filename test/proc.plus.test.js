'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber } from '../src/sexp.js'

test('evaluating (+ 1 1) yields 2', () => {
  const code = '(+ 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(2))
})

test('evaluating (+ 1 2 3) yields 6', () => {
  const code = '(+ 1 2 3)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(6))
})

test('evaluating (+ 1 (+ 1 1)) yields 3', () => {
  const code = '(+ 1 (+ 1 1))'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(3))
})

test('evaluating (+ (+ 1 1) (+ 1 1)) yields 4', () => {
  const code = '(+ (+ 1 1) (+ 1 1))'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(4))
})
