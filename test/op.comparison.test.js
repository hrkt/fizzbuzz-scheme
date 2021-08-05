'use strict'

import * as util from './testutil.js'

import log from 'loglevel'
import { FsBoolean } from '../src/sexp.js'

log.setLevel('trace')

// <

test('evaluating (< 0 1) yields #t', () => {
  const code = '(< 0 1)'
  util.expse(code, new FsBoolean(true))
})

test('evaluating (< 1 0) yields #f', () => {
  const code = '(< 1 0)'
  util.expse(code, new FsBoolean(false))
})

test('evaluating (< 1 1) yields #f', () => {
  const code = '(< 1 1)'
  util.expse(code, new FsBoolean(false))
})

// <=

test('evaluating (<= 0 1) yields #t', () => {
  const code = '(<= 0 1)'
  util.expse(code, new FsBoolean(true))
})

test('evaluating (<= 1 0) yields #f', () => {
  const code = '(<= 1 0)'
  util.expse(code, new FsBoolean(false))
})

test('evaluating (<= 1 1) yields #t', () => {
  const code = '(<= 1 1)'
  util.expse(code, new FsBoolean(true))
})

// >

test('evaluating (> 0 1) yields #f', () => {
  const code = '(> 0 1)'
  util.expse(code, new FsBoolean(false))
})

test('evaluating (> 1 0) yields #t', () => {
  const code = '(> 1 0)'
  util.expse(code, new FsBoolean(true))
})

test('evaluating (> 1 1) yields #f', () => {
  const code = '(> 1 1)'
  util.expse(code, new FsBoolean(false))
})

// >=

test('evaluating (>= 0 1) yields #f', () => {
  const code = '(>= 0 1)'
  util.expse(code, new FsBoolean(false))
})

test('evaluating (>= 1 0) yields #t', () => {
  const code = '(>= 1 0)'
  util.expse(code, new FsBoolean(true))
})

test('evaluating (>= 1 1) yields #t', () => {
  const code = '(>= 1 1)'
  util.expse(code, new FsBoolean(true))
})
