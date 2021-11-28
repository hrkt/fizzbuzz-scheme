'use strict'

import { FsException } from '../src/common.js'
import { FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (angle 1) yields 0.0', () => {
  expect(new FBS().eval('(angle 1)')).toStrictEqual(new FsReal(0))
})

test('evaluating (angle 5/3) yields 0.0', () => {
  expect(new FBS().eval('(angle 5/3)')).toStrictEqual(new FsReal(0))
})

test('evaluating (angle 1.0) yields 0.0', () => {
  expect(new FBS().eval('(angle 1.0)')).toStrictEqual(new FsReal(0))
})

test('evaluating (angle 0+0i) yields 0.0', () => {
  expect(new FBS().eval('(angle 0.0i)')).toStrictEqual(new FsReal(0.0))
})

test('evaluating (angle 0+1i) yields 1.5707963267948966', () => {
  expect(new FBS().eval('(angle 0+1i)')).toStrictEqual(new FsReal(1.5707963267948966))
})

test('evaluating (angle 0+-i) yields 1.5707963267948966', () => {
  expect(new FBS().eval('(angle 0-1i)')).toStrictEqual(new FsReal(-1.5707963267948966))
})

test('evaluating (angle 1+2i) yields 1.1071487177940904', () => {
  expect(new FBS().eval('(angle 1+2i)')).toStrictEqual(new FsReal(1.1071487177940904))
})

test('evaluating (angle -1+2i) yields 2.0344439357957027', () => {
  expect(new FBS().eval('(angle -1+2i)')).toStrictEqual(new FsReal(2.0344439357957027))
})

test('evaluating (angle -1-2i) yields -2.0344439357957027', () => {
  expect(new FBS().eval('(angle -1-2i)')).toStrictEqual(new FsReal(-2.0344439357957027))
})

test('evaluating (angle "a") throws exception', () => {
  expect(() => { new FBS().eval('(angle "a")') }).toThrow(FsException)
})
