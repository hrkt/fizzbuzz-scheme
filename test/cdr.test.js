'use strict'

import * as util from './testutil.js'

import { FsNumber, FsList } from '../src/sexp.js'

test('evaluating (cdr (list 1 2)) yields (2)', () => {
  util.codeEvaledTo('(cdr (list 1 2))', new FsList([new FsNumber(2)]))
})
