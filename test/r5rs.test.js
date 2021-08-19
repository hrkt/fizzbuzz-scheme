// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-2.html#%_toc_start

'use strict'

import { FizzBuzzScheme } from '../src/index.js'
import { FsNumber } from '../src/sexp.js'

test('1.3.4', () => {
  const code = '(* 5 8)'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code)).toStrictEqual(new FsNumber(40))
})

test('2.2', () => {
  const code = `;;; The FACT procedure computes the factorial
  ;;; of a non-negative integer.
  (define fact
    (lambda (n)
      (if (= n 0)
          1        ;Base case: return 1
          (* n (fact (- n 1))))))
  (fact 10)
  `

  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code)).toStrictEqual(new FsNumber(3628800))
})

test('4.1.1', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define x 28)')
  expect(fbs.eval('x')).toStrictEqual(new FsNumber(28))
})

test('4.1.2', () => {
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval('(quote a)').toString()).toBe('a')

  // TODO:
  // expect(fbs.eval('(quote #(a b c))').toString()).toBe('#(a b c)')

  expect(fbs.eval('(quote (+ 1 2))').toString()).toBe('(+ 1 2)')
})

test('4.2.2', () => {
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval('(let ((x 2) (y 3)) (* x y))')).toStrictEqual(new FsNumber(6))
})
