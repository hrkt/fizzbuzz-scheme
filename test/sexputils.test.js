'use strict'

import { FsException } from '../src/common.js'
import { FsList } from '../src/datatypes.js'
import { ensureListLengthAtMost } from '../src/sexputils.js'

test('given list of 2 entries, ensureListLengthAtMost() throws an exception', () => {
  expect(() => { ensureListLengthAtMost(new FsList([1, 2]), 1) }).toThrow(FsException)
})
