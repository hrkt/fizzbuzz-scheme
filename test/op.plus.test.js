'use strict'

import * as util from './testutil.js'

import log from 'loglevel'
import { FsNumber } from '../src/sexp.js'
log.setLevel('trace')

test('evaluating (+ 1 1) yields 2', () => {
  const code = '(+ 1 1)'
  util.codeEvaledTo(code, new FsNumber(2))
})

test('evaluating (+ 1 2 3) yields 6', () => {
  const code = '(+ 1 2 3)'
  util.codeEvaledTo(code, new FsNumber(6))
})

test('evaluating (+ 1 (+ 1 1)) yields 3', () => {
  const code = '(+ 1 (+ 1 1))'
  util.codeEvaledTo(code, new FsNumber(3))
})

test('evaluating (+ (+ 1 1) (+ 1 1)) yields 4', () => {
  const code = '(+ (+ 1 1) (+ 1 1))'
  util.codeEvaledTo(code, new FsNumber(4))
})
