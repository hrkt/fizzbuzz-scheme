'use strict'

import FS from 'fs'

import { FsEvaluator } from '../src/evaluator.js'
import { FsParser as FP } from '../src/parser.js'
import log from 'loglevel'

log.setLevel('debug')

test('evaluating comment.test.1.scm', () => {
  const code1 = FS.readFileSync('test/code/comment.test.1.scm', 'utf8')
  expect(FsEvaluator.eval(FP.parse(code1)).toString()).toBe('2')
})
