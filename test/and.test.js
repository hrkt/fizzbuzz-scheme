'use strict'

import { FsEvaluator } from '../src/evaluator.js'
import { FsParser as FP } from '../src/parser.js'
import log from 'loglevel'

test('evaluating (and #t #t) yields #t', () => {
  expect(FsEvaluator.eval(FP.parse('(and #t #t)')).toString()).toBe('#t')
})

test('evaluating (and #t #f) yields #f', () => {
  expect(FsEvaluator.eval(FP.parse('(and #f #f)')).toString()).toBe('#f')
})

test('evaluating (and #f #t) yields #f', () => {
  expect(FsEvaluator.eval(FP.parse('(and #f #f)')).toString()).toBe('#f')
})

test('evaluating (and #f #f) yields #f', () => {
  expect(FsEvaluator.eval(FP.parse('(and #f #f)')).toString()).toBe('#f')
})
