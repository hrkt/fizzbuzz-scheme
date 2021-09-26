'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber } from '../src/sexp.js'

test('evaluating (define a 1)', () => {
  const code = '(define a 1)'
  const fbs = new FBS()
  const ret = fbs.eval(code)
  expect(ret).not.toBeNull()
  expect(ret.value).toBe('a')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(1), fbs)
})

test('evaluating (define a (+ 1 2))', () => {
  const code = '(define a (+ 1 2))'
  const fbs = new FBS()
  const ret = fbs.eval(code)
  expect(ret).not.toBeNull()
  expect(ret.value).toBe('a')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(3), fbs)
})

test('evaluating (define b 1) then (+ 1 b)', () => {
  const fbs = new FBS()
  fbs.eval('(define b 1)')
  expect(fbs.eval('(+ 1 b)')).toStrictEqual(new FsNumber(2))
})

test('evaluating (define (x2 x) (* x 2)) then (x2 1) yields 2', () => {
  const fbs = new FBS()
  fbs.eval('(define (x2 x) (* x 2))')
  expect(fbs.eval('(x2 1)')).toStrictEqual(new FsNumber(2))
})

test('evaluating (define (x3 x y) (+ x y)) then (x3 1 2) yields 3', () => {
  const fbs = new FBS()
  fbs.eval('(define (x3 x y) (+ x y))')
  expect(fbs.eval('(x3 1 2)')).toStrictEqual(new FsNumber(3))
})
