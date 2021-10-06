'use strict'

import { FsException } from './common.js'
import { FsList } from './datatypes.js'

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
