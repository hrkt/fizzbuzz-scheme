'use strict'

import { FsException } from '../src/common.js'
import { FsInteger, FsRational, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (magnitude -1) yields 1', () => {
  expect(new FBS().eval('(magnitude -1)')).toStrictEqual(new FsInteger(1))
})

test('evaluating (magnitude -5/3) yields 5/3', () => {
  expect(new FBS().eval('(magnitude -5/3)')).toStrictEqual(new FsRational(5, 3))
})

test('evaluating (magnitude -1.0) yields 1.0', () => {
  expect(new FBS().eval('(magnitude -1.0)')).toStrictEqual(new FsReal(1.0))
})

test('evaluating (magnitude -1+2i) yields 2.23606797749979', () => {
  expect(new FBS().eval('(magnitude -1+2i)')).toStrictEqual(new FsReal(2.23606797749979))
})

test('evaluating (magnitude "a") throws exception', () => {
  expect(() => { new FBS().eval('(magnitude "a")') }).toThrow(FsException)
})
