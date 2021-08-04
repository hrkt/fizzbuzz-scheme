'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'

import { FsBoolean } from '../src/sexp.js'

test('evaluating true', () => {
  const code = '#t'
  expect(FE.eval(FP.parse(code))).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating false', () => {
  const code = '#f'
  expect(FE.eval(FP.parse(code))).toStrictEqual(FsBoolean.FALSE)
})
