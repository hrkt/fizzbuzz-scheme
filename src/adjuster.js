'use strict'
import { FsError, FsException } from './common.js'
import { FsSymbol } from './sexp.js'
import log from 'loglevel'

export class Adjuster {
  // pre process sexp
  static adjust (sexpList) {
    if (sexpList === undefined) {
      throw new FsError('ERROR: "undefined" was passed to adjest() ')
    }
    if (!Array.isArray(sexpList)) {
      throw new FsError('ERROR: should pass array to adjest() ')
    }

    return sexpList.map(sexp => Adjuster.adjustInner(sexp))
  }

  static adjustInner (sexp) {
    if (sexp === undefined) {
      throw new FsError('ERROR: "undefined" was passed to adjestInner() ')
    }
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug(JSON.stringify(sexp, null, 2))
    }
    if (!Array.isArray) {
      return sexp
    } else if (sexp[0] === FsSymbol.IF) {
      if (sexp.length <= 2) {
        throw new FsException('Syntax Error: malformed if:' + sexp)
      }
      if (sexp.length === 3) {
        // ex. [if #t 1] => [if #t 1 null]
        sexp.push(null)
      }
      return sexp
    } else {
      return sexp
    }
  }
}
