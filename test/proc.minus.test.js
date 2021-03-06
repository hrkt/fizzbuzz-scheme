'use strict'

import { FsInteger, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (- 1) yields -1', () => {
  const code = '(- 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(-1))
})

test('evaluating (- 1 1) yields 0', () => {
  const code = '(- 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(0))
})

test('evaluating (- 3 1 1) yields 1', () => {
  const code = '(- 3 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (- 3 1.0 1) yields 1.0', () => {
  const code = '(- 3 1.0 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsReal(1.0))
})
