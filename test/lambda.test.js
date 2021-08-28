'use strict'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme } from '../src/index.js'

test('evaluating (define p (lambda (x) (+ x x)))', () => {
  const code = '(define p (lambda (x) (+ x x)))'
  const fbs = new FizzBuzzScheme()

  const ret = fbs.eval(code)
  expect(ret).not.toBeNull()
})

test('evaluating (define p (lambda (x) (+ x x))), then (p 1)', () => {
  const code = '(define p (lambda (x) (+ x x)))'

  const fbs = new FizzBuzzScheme()
  const ret1 = fbs.eval(code)
  expect(ret1).not.toBeNull()
  const ret2 = fbs.eval('(p 1)')
  expect(ret2).not.toBeNull()
  expect(ret2).toStrictEqual(new FsNumber(2))
})
