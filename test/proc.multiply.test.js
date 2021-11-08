'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (* 1) yields 1', () => {
  const code = '(* 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (* 1 3) yields 3', () => {
  const code = '(* 1 3)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(3))
})

test('evaluating (* 3 2 1) yields 6', () => {
  const code = '(* 3 2 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(6))
})

test('evaluating (* 3 0 1) yields 0', () => {
  const code = '(* 3 0 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(0))
})
