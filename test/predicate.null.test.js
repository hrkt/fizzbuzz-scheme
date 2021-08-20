'use strict'

import * as util from './testutil.js'

import log from 'loglevel'
import { FsBoolean } from '../src/sexp.js'
log.setLevel('trace')

test('evaluating (null? ()) yields #t', () => {
  const code = '(null? ())'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating (null? #t) yields #f', () => {
  const code = '(null? #t)'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})

test('evaluating (null? 1) yields #f', () => {
  const code = '(null? 1)'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})

test('evaluating (null? (define x 1)) yields #f', () => {
  const code = '(null? (define x 1))'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})
