'use strict'

import log from 'loglevel'
import { SExpFactory } from './sexp.js'

// Parser
export class FsParser {
  static tokenize (code) {
    const tokenList = []
    let buf = ''
    let i = 0
    log.debug(code)
    while (i < code.length) {
      let c = code.charAt(i)
      if (c === ' ') {
        i++
        continue
      }
      if (c === '(' || c === ')') {
        tokenList.push(c)
        i++
        continue
      }
      while (i < code.length && c !== ' ' && c !== ')') {
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
      while (tokenized[0] !== ')') {
        l.push(this.readTokens(tokenized))
      }
      tokenized.shift()
      return l
    } else if (t === ')') {
      //
    } else {
      return this.element(t)
    }
  }

  static parse (code) {
    log.debug('------')
    log.debug('parse: ' + code)
    const tokenized = this.tokenize(code)
    log.debug('------')
    log.debug('tokenized: tokenized' + tokenized)
    const parsed = this.readTokens(this.tokenize(code))
    log.debug('------')
    log.debug('parsed: tokenized' + parsed)
    return parsed
  }
}
