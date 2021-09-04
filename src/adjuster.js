'use strict'
import { FsError, FsException } from './common.js'
import { FsSymbol } from './sexp.js'
import log from 'loglevel'

export class FsAdjuster {
  // pre process sexp
  static adjust (sexpList) {
    if (sexpList === undefined) {
      throw new FsError('ERROR: "undefined" was passed to adjest() ')
    }
    if (!Array.isArray(sexpList)) {
      throw new FsError('ERROR: should pass array to adjest() ')
    }

    const ret = sexpList.map(sexp => FsAdjuster.adjustInner(sexp))
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('------')
      log.debug(ret.length)
      log.debug('adjusted: ' + ret)
      log.debug(JSON.stringify(ret, null, 2))
    }
    return ret
  }

  static ensureListContains (list, length) {
    if (!Array.isArray(list) || list.length !== length) {
      throw new Error('Syntax Error: this procedure must take ' + length + ' argument(s) as list')
    }
  }

  static ensureListContainsTwo (list) {
    FsAdjuster.ensureListContains(list, 2)
  }

  static ensureListContainsOne (list) {
    FsAdjuster.ensureListContains(list, 1)
  }

  static adjustInner (sexp) {
    if (sexp === undefined) {
      throw new FsError('ERROR: "undefined" was passed to adjustInner() ')
    }
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug(JSON.stringify(sexp, null, 2))
      console.dir(sexp[0])
    }
    if (!Array.isArray(sexp)) {
      // it passes "null".
      // ex. after adjusting (if #f 1) => (if #f 1 null)
      return sexp
    } else if (sexp[0] === FsSymbol.IF) {
      if (sexp.length <= 2) {
        throw new FsException('Syntax Error: malformed if:' + sexp)
      }
      if (sexp.length === 3) {
        // ex. [if #t 1] => [if #t 1 null]
        sexp.push(null)
      }
      return sexp.map(sexp => FsAdjuster.adjustInner(sexp))
    } else if (sexp[0] instanceof FsSymbol && (
      sexp[0].value === '<' ||
      sexp[0].value === '<=' ||
      sexp[0].value === '>' ||
      sexp[0].value === '>='
    )) {
      if (sexp.length <= 2) {
        throw new FsException('Syntax Error: malformed :' + sexp)
      }
      return sexp.map(sexp => FsAdjuster.adjustInner(sexp))
    } else {
      return sexp
    }
  }
}
