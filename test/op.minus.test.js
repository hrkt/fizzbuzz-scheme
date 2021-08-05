'use strict'

import * as util from './testutil.js'

import log from 'loglevel'
import { FsNumber } from '../src/sexp.js'
log.setLevel('trace')

test('evaluating (- 1) yields 0', () => {
  const code = '(- 1)'
  util.expse(code, new FsNumber(-1))
})

test('evaluating (- 1 1) yields 0', () => {
  const code = '(- 1 1)'
  util.expse(code, new FsNumber(0))
})

test('evaluating (- 3 1 1) yields 1', () => {
  const code = '(- 3 1 1)'
  util.expse(code, new FsNumber(1))
})
