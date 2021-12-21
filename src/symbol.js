'use strict'

import { FsSExp } from './sexpbase.js'

export class FsSymbol extends FsSExp {
  static BACK_QUOTE = Object.freeze(new FsSymbol('`'))
  static BEGIN = Object.freeze(new FsSymbol('begin'))
  static COMMA = Object.freeze(new FsSymbol(','))
  static COMMA_FOLLOWED_BY_AT = Object.freeze(new FsSymbol(',@'))
  static COND = Object.freeze(new FsSymbol('cond'))
  static DELAY = Object.freeze(new FsSymbol('delay'))
  static DO = Object.freeze(new FsSymbol('do'))
  static DOT = Object.freeze(new FsSymbol('.'))
  static DEFINE = Object.freeze(new FsSymbol('define'))
  static DEFINE_MACRO = Object.freeze(new FsSymbol('define-macro'))
  static ELSE = Object.freeze(new FsSymbol('else'))
  static EOF_OBJECT = Object.freeze(new FsSymbol('eof-object'))
  static FOR_EACH = Object.freeze(new FsSymbol('for-each'))
  static IF = Object.freeze(new FsSymbol('if'))
  static LAMBDA = Object.freeze(new FsSymbol('lambda'))
  static LET = Object.freeze(new FsSymbol('let'))
  static LET_ASTERISK = Object.freeze(new FsSymbol('let*'))
  static LETREC = Object.freeze(new FsSymbol('letrec'))
  static LETREC_ASTERISK = Object.freeze(new FsSymbol('letrec*'))
  static MAP = Object.freeze(new FsSymbol('map'))
  static OR = Object.freeze(new FsSymbol('or'))
  static QUASIQUOTE = Object.freeze(new FsSymbol('quasiquote'))
  static QUOTE = Object.freeze(new FsSymbol('quote'))
  static SINGLE_QUOTE = Object.freeze(new FsSymbol('\''))
  static SET_ = Object.freeze(new FsSymbol('set!'))
  static SET_CDR_ = Object.freeze(new FsSymbol('set-cdr!'))
  static UNQUOTE = Object.freeze(new FsSymbol('unquote'))
  static TEST_IS_TRUE_THEN = Object.freeze(new FsSymbol('=>'))
  static intern (str) {
    switch (str) {
      case '.':
        return this.DOT
      case ',':
        return this.COMMA
      case ',@':
        return this.COMMA_FOLLOWED_BY_AT
      case '\'':
        return this.SINGLE_QUOTE
      case '`':
        return this.BACK_QUOTE
      // case '=>':
      //   return this.TEST_IS_TRUE_THEN
      case 'begin':
        return this.BEGIN
      case 'cond':
        return this.COND
      case 'delay':
        return this.DELAY
      case 'define':
        return this.DEFINE
      case 'define-macro':
        return this.DEFINE_MACRO
      case 'do':
        return this.DO
      case 'else':
        return this.ELSE
      case 'for-each':
        return this.FOR_EACH
      case 'if':
        return this.IF
      case 'lambda':
        return this.LAMBDA
      case 'let':
        return this.LET
      case 'let*':
        return this.LET_ASTERISK
      case 'letrec':
        return this.LETREC
      case 'letrec*':
        return this.LETREC_ASTERISK
      case 'map':
        return this.MAP
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
