'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber } from '../src/sexp.js'

test('evaluating (let ((x 1) (y 2)) (+ x y)) yields 3', () => {
  const code = '(let ((x 1) (y 2)) (+ x y)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(3))
})

test('evaluating (let ((x 1)) x) yields 1', () => {
  const code = '(let ((x 1)) x)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})

test('evaluating (let ((x (+ 1 2))) x) yields 1', () => {
  const code = ' (let ((x (+ 1 2))) x)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(3))
})
