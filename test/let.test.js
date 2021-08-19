'use strict'

import * as util from './testutil.js'

import { FsNumber } from '../src/sexp.js'
import log from 'loglevel'
log.setLevel('trace')

test('evaluating (let ((x 1) (y 2)) (+ x y)) yields 3', () => {
  const code = '(let ((x 1) (y 2)) (+ x y)'
  util.codeEvaledTo(code, new FsNumber(3))
})

test('evaluating (let ((x 1)) x) yields 1', () => {
  const code = '(let ((x 1)) x)'
  util.codeEvaledTo(code, new FsNumber(1))
})

test('evaluating (let ((x (+ 1 2))) x) yields 1', () => {
  const code = ' (let ((x (+ 1 2))) x)'
  util.codeEvaledTo(code, new FsNumber(3))
})
