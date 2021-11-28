'use strict'

import { FsException } from '../src/common.js'
import { FsInteger, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (imag-part 1) yields 0', () => {
  expect(new FBS().eval('(imag-part 0)')).toStrictEqual(new FsInteger(0))
})

test('evaluating (imag-part 5/3) yields 0', () => {
  expect(new FBS().eval('(imag-part 5/3)')).toStrictEqual(new FsInteger(0))
})

test('evaluating (imag-part 1.0) yields 0.0', () => {
  expect(new FBS().eval('(imag-part 1.0)')).toStrictEqual(new FsReal(0))
})

test('evaluating (imag-part 1+2i) yields 2.0', () => {
  expect(new FBS().eval('(imag-part 1+2i)')).toStrictEqual(new FsReal(2))
})

test('evaluating (imag-part "a") throws exception', () => {
  expect(() => { new FBS().eval('(imag-part "a")') }).toThrow(FsException)
})
