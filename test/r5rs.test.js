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
