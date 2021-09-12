'use strict'
import { FsError, FsException } from './common.js'
import { FsList, FsPair, FsSymbol, FsUndefined } from './sexp.js'
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
    } else if (isDotPair(sexp)) {
      return toDotPair(sexp)
      // return sexp
    } else {
      return sexp
    }
  }
}

/**
 *
 * @param {*} sexp as FSList
 * @returns true if sexp is a valid pair expression.
 */
function isDotPair (sexp) {
  console.log('check isDotPair?' + sexp)
  if (!(sexp instanceof FsList)) {
    return false
  }
  if (sexp.at(0) !== FsSymbol.QUOTE && sexp.at(0) !== FsSymbol.SINGLE_QUOTE) {
    return false
  }

  const argList = sexp.at(0) === FsSymbol.SINGLE_QUOTE ? sexp.at(1).value : sexp.slice(1)
  if (!(Array.isArray(argList)) || argList.length <= 2) {
    return false
  }
  const dots = argList.filter(s => s === FsSymbol.DOT).length

  if (dots === 0) {
    return false
  } else if (dots >= 2) {
    throw new FsException('Sysntax Error: too many "."s ')
  } else {
    // dots === 1
    console.dir(argList[argList.length - 2])
    if (argList.length >= 3 && argList[argList.length - 2] === Symbol.DOT) {
      return true
    } else {
      throw new FsException('Sysntax Error: bad "." ')
    }
  }
}

function toDotPair (sexp) {
  // sexp should be valid pair style. ie. (x x . x)

  const buf = []
  buf.concat(sexp.value.slice(0, sexp.length - 3))
  buf.concat(sexp.at(sexp.lengh - 1))

  let p = new FsPair(buf.at(buf.length - 2), buf.at(buf.length - 1))
  for (let i = buf.length - 3; i >= 0; i--) {
    const sp = new FsPair(buf.at(i), p)
    p = sp
  }

  return p
}
