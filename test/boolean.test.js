'use strict'

import * as util from './testutil.js'

import { FsBoolean } from '../src/sexp.js'

test('evaluating true', () => {
  const code = '#t'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating false', () => {
  const code = '#f'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})

test('evaluating (boolean? #t) yields #t', () => {
  const code = '(boolean? #t)'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating (boolean? #f) yields #t', () => {
  const code = '(boolean? #f)'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating (boolean? 0) yields #f', () => {
  const code = '(boolean? 0)'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})
