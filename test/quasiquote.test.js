'use strict'

import { FizzBuzzScheme } from '../src/index.js'

test('evaluating (quasiquote (list (unquote (+ 1 2)) 4)) yields (list 3 4)', () => {
  const code = '(quasiquote (list (unquote (+ 1 2)) 4))'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('(list 3 4)')
})

test('evaluating `(list (unquote (+ 1 2)) 4) yields (list 3 4)', () => {
  const code = '`(list (unquote (+ 1 2)) 4)'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('(list 3 4)')
})

test('evaluating `(list ,(+ 1 2) 4) yields (list 3 4)', () => {
  const code = '`(list ,(+ 1 2) 4)'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('(list 3 4)')
})
