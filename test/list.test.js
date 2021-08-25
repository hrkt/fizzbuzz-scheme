'use strict'

import * as util from './testutil.js'

import { FsBoolean, FsList, FsNumber } from '../src/sexp.js'
import log from 'loglevel'
log.setLevel('trace')

test('evaluating (list 1 2) yields (1 2)', () => {
  const code = '(list 1 2)'
  util.codeEvaledTo(code, new FsList([new FsNumber(1), new FsNumber(2)]))
})

test('evaluating (list? ()) yields #t', () => {
  const code = '(list? ())'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating (list? (list 1 2)) yields #t', () => {
  const code = '(list? (list 1 2))'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating (list? 1) yields #f', () => {
  const code = '(list? 1)'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})
