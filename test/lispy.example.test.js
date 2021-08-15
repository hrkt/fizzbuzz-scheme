'use strict'

import log from 'loglevel'
import { FizzBuzzScheme } from '../src/index.js'
import { FsNumber } from '../src/sexp.js'
log.setLevel('debug')

test('evaluating area', () => {
  const code = '(define area (lambda (r) (* 3.141592653 (* r r))))'
  const fbs = new FizzBuzzScheme()
  fbs.eval(code)
  const ret = fbs.eval('(area 3)')
  console.dir(ret)
  expect(ret).toStrictEqual(new FsNumber(28.274333877))
})

test('evaluating fact', () => {
  const code = ' (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))'
  const fbs = new FizzBuzzScheme()
  fbs.eval(code)
  const ret = fbs.eval('(fact 10)')
  console.dir(ret)
  expect(ret).toStrictEqual(new FsNumber(3628800))
})
