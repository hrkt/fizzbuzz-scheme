'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'

import log from 'loglevel'
log.setLevel('trace')

test('evaluating (+ 1 1) yields 2', () => {
  const code = '(+ 1 1)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('2')
})

test('evaluating (+ 1 2 3) yields 6', () => {
  const code = '(+ 1 2 3)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('6')
})

test('evaluating (+ 1 (+ 1 1)) yields 3', () => {
  const code = '(+ 1 (+ 1 1))'
  expect(FE.eval(FP.parse(code)).toString()).toBe('3')
})

test('evaluating (+ (+ 1 1) (+ 1 1)) yields 4', () => {
  const code = '(+ (+ 1 1) (+ 1 1))'
  expect(FE.eval(FP.parse(code)).toString()).toBe('4')
})
