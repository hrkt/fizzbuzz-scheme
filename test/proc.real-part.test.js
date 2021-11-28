'use strict'

import { FsException } from '../src/common.js'
import { FsInteger, FsRational, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (real-part 1) yields 1', () => {
  expect(new FBS().eval('(real-part 1)')).toStrictEqual(new FsInteger(1))
})

test('evaluating (real-part 5/3) yields 5/3', () => {
  expect(new FBS().eval('(real-part 5/3)')).toStrictEqual(new FsRational(5, 3))
})

test('evaluating (real-part 1.0) yields 1.0', () => {
  expect(new FBS().eval('(real-part 1.0)')).toStrictEqual(new FsReal(1))
})

test('evaluating (real-part 1+2i) yields 1.0', () => {
  expect(new FBS().eval('(real-part 1+1i)')).toStrictEqual(new FsReal(1))
})

test('evaluating (real-part "a") throws exception', () => {
  expect(() => { new FBS().eval('(real-part "a")') }).toThrow(FsException)
})
