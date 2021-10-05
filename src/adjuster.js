'use strict'
import { FsError, FsException } from './common.js'
import { FsUndefined } from './sexp.js'
import log from 'loglevel'
import { FsList } from './datatypes.js'
import { FsSymbol } from './symbol.js'

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
      for (let i = 0; i < ret.length; i++) {
        log.debug('adjusted : ' + i + ' : >>> ' + ret[i] + ' <<<')
      }
      log.debug('------')
      log.debug(JSON.stringify(ret, null, 2))
      log.debug('------')
    }
    return ret
  }

  static adjustInner (sexp) {
    if (sexp === undefined) {
      throw new FsError('ERROR: "undefined" was passed to adjustInner() ')
    }
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug(JSON.stringify(sexp, null, 2))
    }
    if (!(sexp instanceof FsList)) {
      // it passes "null".
      // ex. after adjusting (if #f 1) => (if #f 1 null)
      return sexp
    // } if (Array.isArray(sexp) && sexp.length === 0) {
    //   return FsList.EMPTY
    } else if (sexp.at(0) === FsSymbol.IF) {
      if (sexp.length <= 2) {
        throw new FsException('Syntax Error: malformed if:' + sexp)
      }
      if (sexp.length === 3) {
        // ex. [if #t 1] => [if #t 1 null]
        sexp.push(FsUndefined.UNDEFINED)
      }
      // return sexp.map(sexp => FsAdjuster.adjustInner(sexp))
      return new FsList(sexp.value.map(sexp => FsAdjuster.adjustInner(sexp)))
    } else if (sexp.at(0) instanceof FsSymbol && (
      sexp.at(0).value === '<' ||
      sexp.at(0).value === '<=' ||
      sexp.at(0).value === '>' ||
      sexp.at(0).value === '>='
    )) {
      if (sexp.length <= 2) {
        throw new FsException('Syntax Error: malformed :' + sexp)
      }
      // return sexp.map(sexp => FsAdjuster.adjustInner(sexp))
      return new FsList(sexp.value.map(sexp => FsAdjuster.adjustInner(sexp)))
    } else if (sexp.at(0) instanceof FsSymbol && sexp.at(0).value === 'set!') {
      if (sexp.length !== 3) {
        throw new FsException('Syntax Error: malformed :' + sexp)
      }
      return sexp
    } else {
      return sexp
    }
  }
}
