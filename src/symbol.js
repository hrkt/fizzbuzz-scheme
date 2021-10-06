'use strict'

import { FsAtom } from './sexpbase.js'

export class FsSymbol extends FsAtom {
    static IF = Object.freeze(new FsSymbol('if'))
    static QUOTE = Object.freeze(new FsSymbol('quote'))
    static SINGLE_QUOTE = Object.freeze(new FsSymbol('\''))
    static DEFINE = Object.freeze(new FsSymbol('define'))
    static SET_ = Object.freeze(new FsSymbol('set!'))
    static SET_CDR_ = Object.freeze(new FsSymbol('set-cdr!'))
    static BEGIN = Object.freeze(new FsSymbol('begin'))
    static LAMBDA = Object.freeze(new FsSymbol('lambda'))
    static LET = Object.freeze(new FsSymbol('let'))
    static DOT = Object.freeze(new FsSymbol('.'))
    static intern (str) {
      switch (str) {
        case 'if':
          return this.IF
        case 'quote':
          return this.QUOTE
        case '\'':
          return this.SINGLE_QUOTE
        case 'define':
          return this.DEFINE
        case 'set!':
          return this.SET_
        case 'set-cdr!':
          return this.SET_CDR_
        case 'begin':
          return this.BEGIN
        case 'lambda':
          return this.LAMBDA
        case 'let':
          return this.LET
        case '.':
          return this.DOT
        default:
          return Object.freeze(new FsSymbol(str))
      }
    }

    get type () {
      return 'fssymbol'
    }
}
