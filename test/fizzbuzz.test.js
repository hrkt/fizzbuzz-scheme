'use strict'
import FS from 'fs'

import { FsEvaluator } from '../src/evaluator.js'
import { FsParser as FP } from '../src/parser.js'
import { getGlobalEnv } from '../src/env.js'

import log from 'loglevel'

log.setLevel('debug')

test('executing fizz-buzz sample success', () => {
  const code = FS.readFileSync('./sample/fizzbuzz.scm', 'utf8')

  const env = getGlobalEnv()

  const parsed = FP.parse(code)
  FsEvaluator.eval(parsed, env)
  expect(FsEvaluator.eval(FP.parse('(fb 1)'), env).toString()).toBe('1')
  expect(FsEvaluator.eval(FP.parse('(fb 2)'), env).toString()).toBe('2')
  expect(FsEvaluator.eval(FP.parse('(fb 3)'), env).toString()).toBe('fizz')
  expect(FsEvaluator.eval(FP.parse('(fb 4)'), env).toString()).toBe('4')
  expect(FsEvaluator.eval(FP.parse('(fb 5)'), env).toString()).toBe('buzz')
  expect(FsEvaluator.eval(FP.parse('(fb 6)'), env).toString()).toBe('fizz')
  expect(FsEvaluator.eval(FP.parse('(fb 14)'), env).toString()).toBe('14')
  expect(FsEvaluator.eval(FP.parse('(fb 15)'), env).toString()).toBe('fizzbuzz')
  expect(FsEvaluator.eval(FP.parse('(fb 16)'), env).toString()).toBe('16')
})
