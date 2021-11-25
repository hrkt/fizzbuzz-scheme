'use strict'

import { FsComplex, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (log 1) yields 0.0', () => {
  expect(new FBS().eval('(log 1)')).toStrictEqual(new FsReal(0.0))
})

test('evaluating (log 3/2) yields 0.4054651081081644', () => {
  expect(new FBS().eval('(log 3/2)')).toStrictEqual(new FsReal(0.4054651081081644))
})

test('evaluating (log 1.5) yields 4.4816890703380645', () => {
  expect(new FBS().eval('(log 1.5)')).toStrictEqual(new FsReal(0.4054651081081644))
})

test('evaluating (log 1+1i)) yields ', () => {
  expect(new FBS().eval('(log 1+1i)')).toStrictEqual(new FsComplex(0.3465735902799727, 0.7853981633974483))
})

test('evaluating (exp 0+1i) yields 0.5403023058681398+0.8414709848078965i', () => {
  expect(new FBS().eval('(exp 0+1i)')).toStrictEqual(new FsComplex(0.5403023058681398, 0.8414709848078965))
})
