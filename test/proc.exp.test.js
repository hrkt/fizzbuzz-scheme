'use strict'

import { FsComplex, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (exp 0) yields 1', () => {
  expect(new FBS().eval('(exp 0)')).toStrictEqual(new FsReal(1.0))
})

test('evaluating (exp 1) yields 2.718281828459045', () => {
  expect(new FBS().eval('(exp 1)')).toStrictEqual(new FsReal(2.718281828459045))
})

test('evaluating (exp 1.5) yields 4.4816890703380645', () => {
  expect(new FBS().eval('(exp 1.5)')).toStrictEqual(new FsReal(4.4816890703380645))
})

test('evaluating (exp 3/2) yields 4.4816890703380645', () => {
  expect(new FBS().eval('(exp 1.5)')).toStrictEqual(new FsReal(4.4816890703380645))
})

test('evaluating (exp 0+1i) yields 0.5403023058681398+0.8414709848078965i', () => {
  expect(new FBS().eval('(exp 0+1i)')).toStrictEqual(new FsComplex(0.5403023058681398, 0.8414709848078965))
})
