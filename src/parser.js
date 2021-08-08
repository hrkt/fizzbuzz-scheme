'use strict'

import log from 'loglevel'
import { SExpFactory } from './sexp.js'

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
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
        i++
        continue
      } else if (c === ';') {
        while (i < code.length && c !== '\n') {
          i++
          c = code.charAt(i)
        }
        continue
      }
      if (c === '(' || c === ')') {
        tokenList.push(c)
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
      if (c === ')') {
        tokenList.push(c)
      } else {
        //
      }
      i++
    }
    return tokenList
  }

  static element (token) {
    return SExpFactory.build(token)
  }

  static readTokens (tokenized) {
    const t = tokenized.shift()
    if (t === '(') {
      const l = []
      while (tokenized[0] !== ')' && tokenized.length > 0) {
        l.push(FsParser.readTokens(tokenized))
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
    const orders = FsParser.readTokensOuter(this.tokenize(code))
    log.debug('------')
    log.debug(orders.length)
    log.debug('parsed: ' + orders)

    return orders
  }
}
