'use strict'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsException } from '../src/common.js'

test('evaluating (set! a 1) before defining symbol throws FsException', () => {
  const code = '(set! a 1)'
  const fbs = new FBS()
  expect(() => { fbs.eval(code) }).toThrow(FsException)
})

test('evaluating (set! a 1) after defining symbol success', () => {
  const code = '(set! a 1)'
  const fbs = new FBS()
  fbs.eval('(define a 0)')
  fbs.eval(code)
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(1))
})

test('multiple set! success', () => {
  const fbs = new FBS()
  fbs.eval('(define a 0)')
  fbs.eval('(set! a 1)')
  fbs.eval('(set! a 2)')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(2))
})

test('set! value with symbol success', () => {
  const fbs = new FBS()
  fbs.eval('(define a 0)')
  fbs.eval('(define b 1)')
  fbs.eval('(set! a b)')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(1))
})

test('set! value in inner env success', () => {
  const fbs = new FBS()
  fbs.eval('(define a 0)')
  fbs.eval('(if (< 1 2) (set! a 1) (set! a 2))')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(1))
  fbs.eval('(if (> 1 2) (set! a 1) (set! a 2))')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(2))
})
