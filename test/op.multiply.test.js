'use strict'

import * as util from './testutil.js'

import log from 'loglevel'
import { FsNumber } from '../src/sexp.js'
log.setLevel('trace')

test('evaluating (* 1) yields 1', () => {
  const code = '(* 1)'
  util.expse(code, new FsNumber(1))
})

test('evaluating (* 1 3) yields 3', () => {
  const code = '(* 1 3)'
  util.expse(code, new FsNumber(3))
})

test('evaluating (* 3 2 1) yields 6', () => {
  const code = '(* 3 2 1)'
  util.expse(code, new FsNumber(6))
})

test('evaluating (* 3 0 1) yields 0', () => {
  const code = '(* 3 0 1)'
  util.expse(code, new FsNumber(0))
})
