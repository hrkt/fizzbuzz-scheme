/* eslint-disable no-new */
'use strict'

import { FsException } from '../src/common.js'
import { FsAtom } from '../src/sexp.js'

// > Note: You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail."
// https://jestjs.io/docs/expect#tothrowerror
test('instanciating abstract class throws Exception', () => {
  expect(() => { new FsAtom('a') }).toThrow(FsException)
})
