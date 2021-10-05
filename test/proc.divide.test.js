'use strict'

import { FsException } from '../src/common.js'
import { FsNumber } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (/ 1) yields 1', () => {
  const code = '(/ 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})

test('evaluating (/ 3 1) yields 3', () => {
  const code = '(/ 3 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(3))
})

test('evaluating (/ 3 3) yields 1', () => {
  const code = '(/ 3 3)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})

test('evaluating (/ 1 0) throws error', () => {
  const code = '(/ 1 0)'
  expect(() => { new FBS().eval(code) }).toThrow(FsException)
})

test('evaluating (/ 0) throws error', () => {
  const code = '(/ 0)'
  expect(() => { new FBS().eval(code) }).toThrow(FsException)
})
