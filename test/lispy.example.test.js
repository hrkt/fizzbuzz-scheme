'use strict'

// test sample expressions from http://norvig.com/lispy.html

import * as util from './testutil.js'

// import log from 'loglevel'
import { FizzBuzzScheme } from '../src/index.js'
import { FsNumber } from '../src/sexp.js'
// log.setLevel('debug')

test('evaluating circle-area', () => {
  const code = '(define circle-area (lambda (r) (* 3.141592653 (* r r))))'
  const fbs = new FizzBuzzScheme()
  fbs.eval(code)
  util.codeEvaledTo('(circle-area 3)', new FsNumber(28.274333877), fbs)
})

test('evaluating fact', () => {
  const code = ' (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))'
  const fbs = new FizzBuzzScheme()
  fbs.eval(code)
  util.codeEvaledTo('(fact 10)', new FsNumber(3628800), fbs)
})

test('evaluating repeat', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define twice (lambda (x) (* 2 x)))')
  util.codeEvaledTo('(twice 5)', new FsNumber(10), fbs)
  fbs.eval('(define repeat (lambda (f) (lambda (x) (f (f x)))))')
  util.codeEvaledTo('((repeat twice) 10)', new FsNumber(40), fbs)
  util.codeEvaledTo('((repeat (repeat (repeat twice))) 10)', new FsNumber(2560), fbs)
  util.codeEvaledTo('((repeat (repeat (repeat twice))) 10)', new FsNumber(2560), fbs)
  util.codeEvaledTo('((repeat (repeat (repeat (repeat twice)))) 10)', new FsNumber(655360), fbs)
})

test('evaluating pow', () => {
  util.codeEvaledTo('(pow 2 16)', new FsNumber(65536))
})

test('evaluating range', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))')
  fbs.eval('(define range (lambda (a b) (if (= a b) (quote ()) (cons a (range (+ a 1) b)))))')
  expect(fbs.eval('(range 0 10)').toString()).toBe('(0 1 2 3 4 5 6 7 8 9)')
  expect(fbs.eval('(map fib (range 0 10))').toString()).toBe('(1 1 2 3 5 8 13 21 34 55)') // in 20ms
  // expect(fbs.eval('(map fib (range 0 20))').toString()).toBe('(1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181 6765)') // in 400ms
})

// this does not work either on fbs or on gauche
// (define count (lambda (item L) (if L (+ (equal? item (first L)) (count item (rest L))) 0)))
// (count 0 (list 0 1 2 3 0 0))
