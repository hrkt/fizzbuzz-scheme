'use strict'

import log from 'loglevel'
import { FsException } from './common.js'
import { FsSymbol, SExpFactory } from './sexp.js'

// Parser
export class FsParser {
  static tokenize (code) {
    const tokenList = []
    let buf = ''
    let i = 0
    log.debug('tokenizing: length=' + code.length)
    log.debug(code)

    // eslint-disable-next-line no-labels
    nextLoop:
    while (i < code.length) {
      let c = code.charAt(i)
      log.debug('i: ' + i + '\tc:' + c)
      // found comment char, then read to the end of line ignoring comments.
      if (c === ';') {
        while (i < code.length && c !== '\n') {
          i++
          c = code.charAt(i)
        }
        continue
      }

      // found brackets or quote chars, then use it as token and continue.
      if (c === '(' || c === ')' || c === '\'') {
        tokenList.push(c)
        i++
        continue
      }

      // found double quote, then read eager.
      if (c === '"') {
        buf += c
        i++

        while (i < code.length) {
          log.debug('\ti: ' + i + '\tc:' + code.charAt(i))
          if (code.charAt(i) === '\\' && code.charAt(i + 1) === '"') {
            buf += '\\"'
            i += 2
          } else if (code.charAt(i) === '"') {
            buf += '"'
            tokenList.push(buf)
            buf = ''
            i++
            log.debug('continue to nextLoop:, i=' + i)
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
    if (t === '\'') {
      const l = []
      // l.push(FsParser.element('\''))
      l.push(FsSymbol.SINGLE_QUOTE)
      l.push(FsParser.readTokens(tokenized, true))
      log.debug('created array : ' + l.length)
      return l
    }
    if (t === '(') {
      const l = []
      while (tokenized[0] !== ')' && tokenized.length > 0) {
        l.push(FsParser.readTokens(tokenized, inQuoted))
      }
      tokenized.shift()
      return l
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
      log.debug('parse: ' + code)
    }
    const tokenized = this.tokenize(code)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('------')
      log.debug('tokenized: ' + tokenized)
    }
    const orders = FsParser.readTokensOuter(tokenized)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('------')
      log.debug(orders.length)
      log.debug('parsed: ' + orders)
      log.debug(JSON.stringify(orders, null, 2))
    }
    return orders
  }
}
