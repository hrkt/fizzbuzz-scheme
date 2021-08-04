'use strict'

import { FsEvaluator } from '../src/evaluator.js'
import { FsParser as FP } from '../src/parser.js'
import log from 'loglevel'

test('evaluating (quote 1) yields 1', () => {
  const code = '(quote 1)'
  const parsed = FP.parse(code)
  expect(FsEvaluator.eval(parsed).toString()).toBe('1')
})

test('evaluating (quote (+ 1 1)) yields (+ 1 1)', () => {
  const code = '(quote (+ 1 1))'
  const parsed = FP.parse(code)
  console.dir(parsed)
  // log.debug(FsEvaluator.eval(parsed))
  // expect(FsEvaluator.eval(parsed).toString()).toBe('(+ 1 1)')
})
