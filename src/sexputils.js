'use strict'

import { FsError, FsException } from './common.js'
import { FsList } from './datatypes.js'

export function ensureListLengthAtLeast (list, length) {
  if (list === undefined || length === undefined) {
    throw new FsError('system error. list or length is undefined.')
  }

  if (!(list instanceof FsList) || list.length < length) {
    throw new FsException('this procedure must take at least ' + length + ' argument(s) as list')
  }
}

export function ensureListLengthAtMost (list, length) {
  if (list === undefined || length === undefined) {
    throw new FsError('system error. list or length is undefined.')
  }

  if (!(list instanceof FsList) || list.length > length) {
    throw new FsException('this procedure must take at most ' + length + ' argument(s) as list')
  }
}

function ensureListContains (list, length) {
  if (!(list instanceof FsList) || list.length !== length) {
    throw new FsException('this procedure must take ' + length + ' argument(s) as list')
  }
}

export function ensureListContainsOne (list) {
  ensureListContains(list, 1)
}
export function ensureListContainsTwo (list) {
  ensureListContains(list, 2)
}

export function ensureListContainsThree (list) {
  ensureListContains(list, 3)
}

export function ensureValueIsTypeOf (value, type) {
  if (!(value instanceof type)) {
    throw new FsException('arg should be ' + type.name + ' but got ' + value)
  }
}

export function ensureListContainsOnlyTypeOf (list, type) {
  if (!(list instanceof FsList)) {
    throw new FsError('sytem error. 1st arg is not a FsList')
  }
  for (let i = 0; i < list.length; i++) {
    if (!(list.at(i) instanceof type)) {
      throw new FsException('arg should be ' + type.name + ' but got ' + list.at(i))
    }
  }
}

export function isTrueForAllPaisInOrder (list, funcName) {
  for (let i = 0; i < list.length - 1; i++) {
    if (!(list.at(i)[funcName]((list.at(i + 1))))) {
      return false
    }
  }
  return true
}

// e.g.
// let x = 1
// ensurePredicate(x, (x) => {return x > 0}, ' should be plus')
export function ensurePredicate (x, predicateFunction, message = '') {
  if (!predicateFunction(x)) {
    throw new FsException('ERROR: ' + x + ' ' + message)
  }
}
