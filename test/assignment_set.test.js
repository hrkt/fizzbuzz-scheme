'use strict'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme } from '../src/index.js'
import { FsError } from '../src/common.js'

test('evaluating (set a 1) before defining symbol throws FsError', () => {
  const code = '(set! a 1)'
  const fbs = new FizzBuzzScheme()
  expect(() => { fbs.eval(code) }).toThrow(FsError)
})

test('evaluating (set a 1) after defining symbol throws FsError', () => {
  const code = '(set! a 1)'
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define a 0)')
  fbs.eval(code)
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(1))
})

test('multiple set! success', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define a 0)')
  fbs.eval('(set! a 1)')
  fbs.eval('(set! a 2)')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(2))
})
