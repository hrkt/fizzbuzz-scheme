'use strict'

import * as util from './testutil.js'

import { FsBoolean } from '../src/sexp.js'
import { FizzBuzzScheme } from '../src/index.js'
import { FsException } from '../src/common.js'

test('evaluating (= 1 1) yields true', () => {
  util.codeEvaledTo('(= 1 1)', FsBoolean.TRUE)
})

test('evaluating (= 1 2) yields false', () => {
  util.codeEvaledTo('(= 1 2)', FsBoolean.FALSE)
})

test('evaluating (= 1 \'a) throws FsException', () => {
  const fbs = new FizzBuzzScheme()
  expect(() => { fbs.eval('(= 1 \'a)') }).toThrow(FsException)
})

test('evaluating (= \'a 1) throws FsException', () => {
  const fbs = new FizzBuzzScheme()
  expect(() => { fbs.eval('(= \'a 1)') }).toThrow(FsException)
})
