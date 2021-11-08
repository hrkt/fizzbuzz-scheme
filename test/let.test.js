'use strict'

import { FsBoolean, FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (let ((x 1) (y 2)) (+ x y)) yields 3', () => {
  const code = '(let ((x 1) (y 2)) (+ x y)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(3))
})

test('evaluating (let ((x 1)) x) yields 1', () => {
  const code = '(let ((x 1)) x)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (let ((x (+ 1 2))) x) yields 1', () => {
  const code = ' (let ((x (+ 1 2))) x)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(3))
})

test('evaluating (let ((x \'(a))) (list? x)) yields #t', () => {
  expect(new FBS().eval('(let ((x \'(a))) (list? x))')).toStrictEqual(FsBoolean.TRUE)
})
