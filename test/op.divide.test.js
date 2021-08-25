'use strict'

import * as util from './testutil.js'

import log from 'loglevel'
import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsException } from '../src/common.js'

log.setLevel('trace')

test('evaluating (/ 1) yields 1', () => {
  const code = '(/ 1)'
  util.codeEvaledTo(code, new FsNumber(1))
})

test('evaluating (/ 3 1) yields 3', () => {
  const code = '(/ 3 1)'
  util.codeEvaledTo(code, new FsNumber(3))
})

test('evaluating (/ 3 3) yields 1', () => {
  const code = '(/ 3 3)'
  util.codeEvaledTo(code, new FsNumber(1))
})

test('evaluating (/ 1 0) throws error', () => {
  const code = '(/ 1 0)'
  expect(() => { new FBS().eval(code) }).toThrow(FsException)
})
