'use strict'

import { FsError } from '../src/common.js'
import { FsSExp } from '../src/sexpbase.js'

test('instanciating FsExp throws FsError', () => {
  // eslint-disable-next-line no-new
  expect(() => { new FsSExp() }).toThrow(FsError)
})
