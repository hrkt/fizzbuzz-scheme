'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber } from '../src/datatypes.js'

test('evaluating (- 1) yields 0', () => {
  const code = '(- 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(-1))
})

test('evaluating (- 1 1) yields 0', () => {
  const code = '(- 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(0))
})

test('evaluating (- 3 1 1) yields 1', () => {
  const code = '(- 3 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})
