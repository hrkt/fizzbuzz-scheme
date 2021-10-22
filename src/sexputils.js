'use strict'

import { FsException } from './common.js'
import { FsList } from './datatypes.js'

export function ensureListLengthAtLeast (list, length) {
  if (!(list instanceof FsList) || list.length < length) {
    throw new FsException('this procedure must take at least ' + length + ' argument(s) as list')
  }
}

function ensureListContains (list, length) {
  if (!(list instanceof FsList) || list.length !== length) {
    throw new FsException('this procedure must take ' + length + ' argument(s) as list')
  }
}

export function ensureListContainsTwo (list) {
  ensureListContains(list, 2)
}

export function ensureListContainsOne (list) {
  ensureListContains(list, 1)
}

// e.g.
// let x = 1
// ensurePredicate(x, (x) => {return x > 0}, ' should be plus')
export function ensurePredicate (x, predicateFunction, message = '') {
  if (!predicateFunction(x)) {
    throw new FsException('ERROR: ' + x + ' ' + message)
  }
}
