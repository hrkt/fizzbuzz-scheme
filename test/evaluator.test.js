'use strict'

import { FsNumber } from '../src/datatypes'
import { FsEvaluator } from '../src/evaluator'
import { FsParser } from '../src/parser'

test('eval called without env param success', () => {
  const code = '(+ 1 2)'
  const parsed = FsParser.parse(code)
  expect(FsEvaluator.eval(parsed[0])).toStrictEqual(new FsNumber(3))
})
