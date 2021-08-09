'use strict'

import FS from 'fs'

import * as util from './testutil.js'

import log from 'loglevel'
import { FsNumber } from '../src/sexp.js'

log.setLevel('debug')

test('evaluating comment.test.1.scm', () => {
  const code1 = FS.readFileSync('test/code/comment.test.1.scm', 'utf8')
  util.codeEvaledTo(code1, new FsNumber(2))
})
