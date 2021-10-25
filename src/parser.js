'use strict'

import log from 'loglevel'

import { FsError, FsException } from './common.js'
import { FsBoolean, FsChar, FsList, FsNumber, FsPair, FsString, FsVector } from './datatypes.js'
import { FsSymbol } from './symbol.js'

export class SExpFactory {
  static build (s) {
    if (s === undefined) {
      throw new FsError('passed undefined.') // isNaN(undefined) ==> true
    }
    if (!isNaN(parseFloat(s)) && !isNaN(s - 0)) {
      return new FsNumber(+s)
    } else if (FsBoolean.isFsBooleanString(s)) {
      return FsBoolean.fromString(s)
    } else if (FsChar.isFsChar(s)) {
      return FsChar.fromString(s)
    } else if (s.startsWith('"')) { // equal or faster compared to  s.charAt(0), s.indexOf('"') === 0
      const extracted = s.substring(1, s.length - 1)
      return new FsString(extracted)
    } else {
      return FsSymbol.intern(s) // avoid creating Gabage
    }
  }
}

// Parser
export class FsParser {
  static tokenize (code) {
    const tokenList = []
    let buf = ''
    let i = 0
    log.debug('tokenizing: length=' + code.length)
    log.trace(code)

    // eslint-disable-next-line no-labels
    nextLoop:
    while (i < code.length) {
      let c = code.charAt(i)
      log.trace('i: ' + i + '\tc:' + c)
      // found comment char, then read to the end of line ignoring comments.
      if (c === ';') {
        while (i < code.length && c !== '\n') {
          i++
          c = code.charAt(i)
        }
        continue
      }

      // found brackets or quote chars, then use it as token and continue.
      if (c === '(' || c === ')' || c === '\'' || c === '`' || c === ',') {
        if (c === ',' && i + 1 < code.length && code.charAt(i + 1) === '@') {
          // quasi-quote special case
          tokenList.push(',@')
          i++ // @
        } else {
          tokenList.push(c)
        }
        i++ // token
        continue
      }

      // vector or boolean letheral
      if (c === '#') {
        if (i + 1 >= code.length) {
          throw new FsException('Syntax Error: at ' + (i + 1))
        }
        // boolean
        if (code.charAt(i + 1) === 't' || code.charAt(i + 1) === 'f') {
          buf += '#' + code.charAt(i + 1)
          i++ // "#"
          i++ // "t" or "f"
          tokenList.push(buf)
          buf = ''
          continue
        }
        // char
        if (code.charAt(i + 1) === '\\') {
          if (i + 2 >= code.length) {
            throw new FsException('Syntax Error: at ' + (i + 2))
          }
          buf += '#' + code.charAt(i + 1) + code.charAt(i + 2)
          i++ // "#"
          i++ // "\"
          i++ // character
          tokenList.push(buf)
          buf = ''
          continue
        }
        // vector
        if (code.charAt(i + 1) === '(') {
          tokenList.push(c)
          i++
          continue
        }
        throw new FsException('Syntax Error: at ' + i)
      }

      // found double quote, then read eager.
      if (c === '"') {
        buf += c
        i++

        while (i < code.length) {
          log.trace('\ti: ' + i + '\tc:' + code.charAt(i))
          if (code.charAt(i) === '\\' && code.charAt(i + 1) === '"') {
            buf += '\\"'
            i += 2
          } else if (code.charAt(i) === '"') {
            buf += '"'
            tokenList.push(buf)
            buf = ''
            i++
            log.trace('continue to nextLoop:, i=' + i)
            // eslint-disable-next-line no-labels
            continue nextLoop
          } else {
            buf += code.charAt(i)
            i++
          }
        }
      }

      if (c === ' ' || FsParser.isControlChar(c)) {
        i++
        continue
      }

      while (i < code.length && c !== ' ' && !FsParser.isControlChar(c) && c !== ')') {
        buf += c
        i++
        c = code.charAt(i)
      }

      tokenList.push(buf)

      buf = ''
    }
    return tokenList
  }

  static isControlChar (c) {
    return c === '\t' || c === '\n' || c === '\r'
  }

  static element (token) {
    return SExpFactory.build(token)
  }

  static readTokens (tokenized, inQuoted = false) {
    const t = tokenized.shift()
    // quoted
    if (t === '\'' || t === '`' || t === ',' || t === ',@') {
      const l = new FsList()
      // l.push(FsParser.element('\''))
      if (t === '\'') {
        l.push(FsSymbol.SINGLE_QUOTE)
      } else if (t === '`') {
        l.push(FsSymbol.BACK_QUOTE)
      } else if (t === ',') {
        l.push(FsSymbol.COMMA)
      } else if (t === ',@') {
        l.push(FsSymbol.COMMA_FOLLOWED_BY_AT)
      }
      l.push(FsParser.readTokens(tokenized, true))
      log.trace('created array : ' + l.length + ' of ' + l)

      if (isDotPair(l)) {
        return toDotPair(l)
      } else {
        return l
      }
    }
    // vector
    if (t === '#') {
      const mutable = !inQuoted
      return new FsVector(FsParser.readTokens(tokenized, inQuoted).value, mutable)
    }
    // list
    if (t === '(') {
      const l = new FsList()
      while (tokenized[0] !== ')' && tokenized.length > 0) {
        l.push(FsParser.readTokens(tokenized, inQuoted))
      }
      tokenized.shift()

      if (isDotPair(l)) {
        return toDotPair(l)
      } else {
        return l
      }
    } else if (t === ')') {
      throw new FsException('syntax error: too much ")"')
    } else {
      return FsParser.element(t)
    }
  }

  static readTokensOuter (tokenized) {
    log.debug('length: ' + tokenized.length)

    const orders = []
    while (tokenized.length > 0) {
      const ret = this.readTokens(tokenized)
      orders.push(ret)
    }
    return orders
  }

  static parse (code) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('------')
      log.debug('parse: >>> ' + code + ' <<<')
    }
    const tokenized = this.tokenize(code)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('------')
      log.debug('tokenized: >>> ' + tokenized + ' <<<')
    }
    const orders = FsParser.readTokensOuter(tokenized)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('------')
      log.debug(orders.length)
      log.debug('parsed: >>> ' + orders + '<<<')
      log.debug('------')
      log.debug(JSON.stringify(orders, null, 2))
      log.debug('------')
    }
    return orders
  }
}

/**
 *
 * @param {*} sexp as FSList
 * @returns true if sexp is a valid pair expression.
 */
function isDotPair (sexp) {
  if (!(sexp instanceof FsList)) {
    return false
  }
  // if (sexp.at(0) === FsSymbol.QUOTE || sexp.at(0) === FsSymbol.SINGLE_QUOTE) {
  //   return false
  // }

  // const argList = sexp.at(0) === FsSymbol.SINGLE_QUOTE ? sexp.at(1).value : sexp.slice(1)
  // if (!(Array.isArray(argList)) || argList.length <= 2) {
  //   return false
  // }
  // const dots = argList.filter(s => s === FsSymbol.DOT).length
  // if (sexp.at(0) === FsSymbol.QUOTE || sexp.at(0) === FsSymbol.SINGLE_QUOTE) {
  const values = sexp.value
  const dots = values.filter(s => s === FsSymbol.DOT).length

  if (dots === 0) {
    return false
  } else if (dots >= 2) {
    throw new FsException('Sysntax Error: too many "."s ')
  } else {
    // dots === 1
    // console.dir(values[values.length - 2])
    if (values.length >= 3 && values[values.length - 2] === FsSymbol.DOT) {
      return true
    } else {
      throw new FsException('Sysntax Error: bad "." ')
    }
  }
}

function toDotPair (sexp) {
  // sexp should be valid pair style. ie. (x x . x)

  let buf = []
  const values = sexp.value
  buf = buf.concat(values.slice(0, values.length - 2), values[values.length - 1])

  let p = new FsPair(buf[buf.length - 2], buf[buf.length - 1])
  for (let i = buf.length - 3; i >= 0; i--) {
    const sp = new FsPair(buf[i], p)
    p = sp
  }

  return p
}
