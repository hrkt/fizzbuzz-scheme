'use strict'

import log from 'loglevel'
import { FsSingleQuoteSymbol, SExpFactory } from './sexp.js'

// Parser
export class FsParser {
  static tokenize (code) {
    const tokenList = []
    let buf = ''
    let i = 0
    log.debug('tokenizing:')
    log.debug(code)
    while (i < code.length) {
      let c = code.charAt(i)
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

      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
        i++
        continue
      }

      while (i < code.length && c !== ' ' && c !== '\t' && c !== '\n' && c !== '\r' && c !== ')') {
        buf += c
        i++
        c = code.charAt(i)
      }
      tokenList.push(buf)
      buf = ''
    }
    return tokenList
  }

  static element (token) {
    return SExpFactory.build(token)
  }

  static readTokens (tokenized, inQuoted = false) {
    const t = tokenized.shift()
    if (t === '\'') {
      const l = []
      // l.push(FsParser.element('\''))
      l.push(new FsSingleQuoteSymbol())
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
      throw Error('came here')
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
    log.debug('------')
    log.debug('parse: ' + code)
    const tokenized = this.tokenize(code)
    log.debug('------')
    log.debug('tokenized: ' + tokenized)
    const orders = FsParser.readTokensOuter(tokenized)
    log.debug('------')
    log.debug(orders.length)
    log.debug('parsed: ' + orders)

    return orders
  }
}
