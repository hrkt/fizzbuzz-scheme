'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsBoolean } from '../src/sexp.js'

test('evaluating (symbol? 1) yields #f', () => {
  expect(new FBS().eval('(symbol? 1)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (symbol? a) yields #f', () => {
  const fbs = new FBS()
  fbs.eval('(define a 1)')
  expect(fbs.eval('(symbol? a)')).toStrictEqual(FsBoolean.FALSE, fbs)
})

test('evaluating (symbol? \'a) yields #t', () => {
  expect(new FBS().eval('(symbol? \'a)')).toStrictEqual(FsBoolean.TRUE)
})
