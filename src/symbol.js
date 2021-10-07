'use strict'

import { FsAtom } from './sexpbase.js'

export class FsSymbol extends FsAtom {
  static BACK_QUOTE = Object.freeze(new FsSymbol('`'))
  static BEGIN = Object.freeze(new FsSymbol('begin'))
  static DOT = Object.freeze(new FsSymbol('.'))
  static DEFINE = Object.freeze(new FsSymbol('define'))
  static IF = Object.freeze(new FsSymbol('if'))
  static LAMBDA = Object.freeze(new FsSymbol('lambda'))
  static LET = Object.freeze(new FsSymbol('let'))
  static QUASIQUOTE = Object.freeze(new FsSymbol('quasiquote'))
  static QUOTE = Object.freeze(new FsSymbol('quote'))
  static SINGLE_QUOTE = Object.freeze(new FsSymbol('\''))
  static SET_ = Object.freeze(new FsSymbol('set!'))
  static SET_CDR_ = Object.freeze(new FsSymbol('set-cdr!'))
  static UNQUOTE = Object.freeze(new FsSymbol('unquote'))
  static intern (str) {
    switch (str) {
      case '.':
        return this.DOT
      case '\'':
        return this.SINGLE_QUOTE
      case '`':
        return this.BACK_QUOTE
      case 'begin':
        return this.BEGIN
      case 'define':
        return this.DEFINE
      case 'if':
        return this.IF
      case 'lambda':
        return this.LAMBDA
      case 'let':
        return this.LET
      case 'quasiquote':
        return this.QUASIQUOTE
      case 'quote':
        return this.QUOTE
      case 'set!':
        return this.SET_
      case 'set-cdr!':
        return this.SET_CDR_
      case 'unquote':
        return this.UNQUOTE
      default:
        return Object.freeze(new FsSymbol(str))
    }
  }

  get type () {
    return 'fssymbol'
  }
}
