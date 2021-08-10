'use strict'

import * as util from './testutil.js'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme } from '../src/index.js'

test('evaluating (define a 1)', () => {
  const code = '(define a 1)'
  const fbs = new FizzBuzzScheme()
  const ret = fbs.eval(code)
  console.dir(ret)
  expect(ret).not.toBeNull()
  expect(ret.value).toBe('a')
  util.codeEvaledTo('a', new FsNumber(1), fbs)
})

test('evaluating (define a (+ 1 2))', () => {
  const code = '(define a (+ 1 2))'
  const fbs = new FizzBuzzScheme()
  const ret = fbs.eval(code)
  console.dir(ret)
  expect(ret).not.toBeNull()
  expect(ret.value).toBe('a')
  util.codeEvaledTo('a', new FsNumber(3), fbs)
})

test('evaluating (define b 1) then (+ 1 b)', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define b 1)')
  util.codeEvaledTo('(+ 1 b)', new FsNumber(2), fbs)
})

test('evaluating (define (x2 x) (* x 2)) then (x2 1) yields 2', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define (x2 x) (* x 2))')
  util.codeEvaledTo('(x2 1)', new FsNumber(2), fbs)
})

test('evaluating (define (x3 x y) (+ x y)) then (x3 x y) yields 3', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define (x3 x y) (+ x y))')
  util.codeEvaledTo('(x3 1 2)', new FsNumber(3), fbs)
})
