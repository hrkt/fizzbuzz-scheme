'use strict'

import { FsInteger, FsRational, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (abs 1) yields 1', () => {
  const code = '(abs 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (abs -1) yields 1', () => {
  const code = '(abs -1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (abs -3/2) yields 3/2', () => {
  expect(new FBS().eval('(abs -3/2)')).toStrictEqual(new FsRational(3, 2))
})

test('evaluating (abs 1+1i) yields 1.4142135623730951', () => {
  expect(new FBS().eval('(abs 1+1i)')).toStrictEqual(new FsReal(1.4142135623730951))
})
