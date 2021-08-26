'use strict'

import * as util from './testutil.js'

import { FsNumber } from '../src/sexp.js'

test('evaluating (car (list 1 2)) yields 1', () => {
  util.codeEvaledTo('(car (list 1 2))', new FsNumber(1))
})
