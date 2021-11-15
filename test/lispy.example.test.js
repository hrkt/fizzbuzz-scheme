'use strict'

// test sample expressions from http://norvig.com/lispy.html

import { FsInteger, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating circle-area', () => {
  const code = '(define circle-area (lambda (r) (* 3.141592653 (* r r))))'
  const fbs = new FBS()
  fbs.eval(code)
  expect(fbs.eval('(circle-area 3)')).toStrictEqual(new FsReal(28.274333877), fbs)
})

test('evaluating fact', () => {
  const code = ' (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))'
  const fbs = new FBS()
  fbs.eval(code)
  expect(fbs.eval('(fact 10)')).toStrictEqual(new FsInteger(3628800), fbs)
})

test('evaluating repeat', () => {
  const fbs = new FBS()
  fbs.eval('(define twice (lambda (x) (* 2 x)))')
  expect(fbs.eval('(twice 5)')).toStrictEqual(new FsInteger(10), fbs)
  fbs.eval('(define repeat (lambda (f) (lambda (x) (f (f x)))))')
  expect(fbs.eval('((repeat twice) 10)')).toStrictEqual(new FsInteger(40), fbs)
  expect(fbs.eval('((repeat (repeat (repeat twice))) 10)')).toStrictEqual(new FsInteger(2560), fbs)
  expect(fbs.eval('((repeat (repeat (repeat twice))) 10)')).toStrictEqual(new FsInteger(2560), fbs)
  expect(fbs.eval('((repeat (repeat (repeat (repeat twice)))) 10)')).toStrictEqual(new FsInteger(655360), fbs)
})

test('evaluating pow', () => {
  expect(new FBS().eval('(pow 2 16)')).toStrictEqual(new FsInteger(65536))
})

test('evaluating range', () => {
  const fbs = new FBS()
  fbs.eval('(define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))')
  fbs.eval('(define range (lambda (a b) (if (= a b) (quote ()) (cons a (range (+ a 1) b)))))')
  expect(fbs.eval('(range 0 10)').toString()).toBe('(0 1 2 3 4 5 6 7 8 9)')
  expect(fbs.eval('(map fib (range 0 10))').toString()).toBe('(1 1 2 3 5 8 13 21 34 55)') // in 20ms
  // expect(fbs.eval('(map fib (range 0 20))').toString()).toBe('(1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181 6765)') // in 400ms
})

test('try tail-recursion', () => {
  const fbs = new FBS()
  const code = `
  (define (sum2 n acc)
  (if (= n 0)
      acc
      (sum2 (- n 1) (+ n acc))))
  `
  fbs.eval(code)
  // without lispy2-like eval style, "RangeError: Maximum call stack size exceeded" occurs
  expect(fbs.eval('(sum2 10000 0)')).toStrictEqual(new FsInteger(50005000))
})

// this does not work either on fbs or on gauche
// (define count (lambda (item L) (if L (+ (equal? item (first L)) (count item (rest L))) 0)))
// (count 0 (list 0 1 2 3 0 0))
