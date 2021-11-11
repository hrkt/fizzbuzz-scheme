'use strict'
import log from 'loglevel'

import { FsException } from './common.js'
import { FsSExp } from './sexpbase.js'

export class FsBoolean extends FsSExp {
    static TRUE_ = Object.freeze(new FsBoolean(true))
    static FALSE_ = Object.freeze(new FsBoolean(false))

    static get TRUE () { return FsBoolean.TRUE_ }
    static get FALSE () { return FsBoolean.FALSE_ }
    // using these direct call do not increase performance, so we use getter
    // static TRUE = FsBoolean.TRUE_
    // static FALSE = FsBoolean.FALSE_

    static isFsBooleanString (s) {
      return (s === '#t' || s === '#f')
    }

    static fromString (s) {
      if (s === '#t') {
        return FsBoolean.TRUE
      } else if (s === '#f') {
        return FsBoolean.FALSE
      }
    }

    toString () {
      return this.value ? '#t' : '#f'
    }
}

export class FsNumber {
  #value
  constructor (v) {
    this.#value = v
  }

  toString () {
    return '' + this.value
  }

  equals (target) {
    return this.value === target.value
  }

  get value () {
    return this.#value
  }

  get type () {
    return 'fsnumber'
  }
}

export class FsChar extends FsSExp {
  static isFsChar (s) {
    return (s.charAt(0) === '#' && s.charAt(1) === '\\' && s.length === 3)
  }

  static fromString (s) {
    // s is "#\a" and previously checked its format.
    return new FsChar(s.charAt(2))
  }

  toString () {
    return this.value
  }

  equals (target) {
    return this.value === target.value
  }
}

export class FsString extends FsSExp {
  toString () {
    return '"' + this.value + '"'
  }
}

export class FsList extends FsSExp {
    static EMPTY = Object.freeze(new FsList([]))
    constructor (value = []) {
      super()
      this.value = value
    }

    get type () {
      return 'fslist'
    }

    push (s) {
      this.value.push(s)
    }

    slice (index) {
      return new FsList(this.value.slice(index))
    }

    get length () {
      return this.value.length
    }

    at (index) {
      return this.value[index]
    }

    set (index, v) {
      this.value[index] = v
    }

    static isEmptyList (arg) {
      return (arg instanceof FsList) && arg.length === 0
    }

    toString () {
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('FsList.toString() called. this.value:' + JSON.stringify(this.value, null, 2))
      }
      if (this.value[0] && this.value[0].value === '\'') {
        log.debug('PRINTING AS SINGLE_QUOTE')
        return '\'' + this.value[1].toString()
      } else if (this.value[0] && this.value[0].value === '`') {
        log.debug('PRINTING AS QUASI_QUOTE')
        return '`' + this.value[1].toString()
      } else if (this.value[0] && this.value[0].value === ',') {
        log.debug('PRINTING AS UNQUOTE')
        return ',' + this.value[1].toString()
      } else {
        // TODO: this is not optimal, but pass sample code in R5RS
        log.debug('PRINTING AS LIST')
        // return '(' + this.value.map(v => v.toString()).join(' ') + ')'
        let buf = ''
        buf += '('
        for (let i = 0; i < this.value.length; i++) {
          if (!Array.isArray(this.value[i])) {
            if (this.value[i]) {
              buf += this.value[i].toString()
            } else {
              buf += '**UNDEFINED**' // for debug purpose
            }
            log.debug(buf)
            buf += ' '
          } else {
            buf += '('
            for (let j = 0; j < this.value[i].length; j++) {
              buf += this.value[i][j]
              buf += ' '
            }
            if (this.value[i].length > 0) {
              buf = buf.substr(0, buf.length - 1)
            }
            buf += ')'
            buf += ' '
          }
        }
        if (this.value.length > 0) {
          buf = buf.substr(0, buf.length - 1)
        }
        buf += ')'
        return buf
      }
    }
}

export class FsVector extends FsSExp {
  /**
     *
     * @param {*} arg Array
     */
  constructor (arg, mutable = true) {
    super()
    this.value = arg
    this.mutable = mutable
  }

  at (index) {
    return this.value[index]
  }

  get length () {
    return this.value.length
  }

  get isMutable () {
    return this.mutable
  }

  toString () {
    return '#(' + this.value.map(s => s.toString()).join(' ') + ')'
  }
}

export class FsPair extends FsList {
  constructor (car, cdr) {
    super()
    this.car = car
    this.cdr = cdr
  }

  get type () {
    return 'fspair'
  }

  get length () {
    let next = this
    let len = 1
    if (next.cdr === FsList.EMPTY) {
      return len
    }

    while (this.cdr instanceof FsPair) {
      next = next.cdr
      len++
      if (next.cdr === FsList.EMPTY) {
        return len
      }
    }
    throw new FsException('can not measure length of an improper pair')
  }

  toString () {
    return '(' + this.car + ' . ' + this.cdr + ')'
  }
}

export function isProperList (arg) {
  if (arg === null) {
    return false
  } else if (arg instanceof FsPair) {
    let next = arg
    if (next.cdr === FsList.EMPTY) {
      return true
    }

    while (next.cdr instanceof FsPair) {
      next = next.cdr
      if (next.cdr === FsList.EMPTY) {
        return true
      }
    }
    return false
  } else if (arg instanceof FsList) {
    return true
  } else {
    return false
  }
}

// numeric

export class FsComplex {
  static #regex = /^[+-]?\d(\.\d+)?[+-]?\d?(\.\d+)?i?$/
  static isStringRep (str) {
    if (!str || str.match(FsComplex.#regex) === null) {
      return false
    }
    return str.match(FsComplex.#regex) !== null
  }
}

export class FsReal {
  static #regex = /^[+-]?\d(\.\d+)?$/
  static isStringRep (str) {
    return str && str.match(FsReal.#regex) !== null
  }
}

function gcd (a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  if (b > a) {
    [a, b] = [b, a] // ES6 destructure
  }
  while (true) {
    if (b === 0) {
      return a
    }
    a %= b
    if (a === 0) {
      return b
    }
    b %= a
  }
}
export class FsRational {
  static #regex = /^[+-]?\d+\/\d+$/
  #numerator
  #denominator

  /**
   * Rational number p/q
   * p ... numerator
   * q ... denominator
   *
   * @param {*} numerator
   * @param {*} denominator
   */
  constructor (numerator, denominator) {
    this.#numerator = parseInt(numerator)
    this.#denominator = parseInt(denominator)
  }

  get numerator () {
    return this.#numerator
  }

  get denominator () {
    return this.#denominator
  }

  equals (that) {
    return this.numerator * that.denominator === this.denominator * that.numerator
  }

  canonicalForm () {
    const g = gcd(this.numerator, this.denominator)
    let newN = this.#numerator
    let newD = this.#denominator
    if (newD < 0) {
      newD = newD * -1
      newN = newN * -1
    }
    newN = newN / g
    newD = newD / g
    if (newD === 1) {
      return new FsInteger(newN)
    } else {
      return new FsRational(newN, newD)
    }
  }

  lessThan (that) {
    return this.numerator * that.denominator < this.denominator * that.numerator
  }

  greaterThan (that) {
    return this.numerator * that.denominator > this.denominator * that.numerator
  }

  add (that) {
    return new FsRational(
      this.numerator * that.denominator + this.denominator * that.numerator,
      this.denominator * that.denominator).canonicalForm()
  }

  subtract (that) {
    return new FsRational(
      this.numerator * that.denominator - this.denominator * that.numerator,
      this.denominator * that.denominator).canonicalForm()
  }

  multiply (that) {
    return new FsRational(
      this.numerator * that.numerator,
      this.denominator * that.denominator).canonicalForm()
  }

  devide (that) {
    return new FsRational(
      this.numerator * that.denominator,
      this.denominator * that.numerator).canonicalForm()
  }

  additiveInverse (that) {
    return new FsRational(
      -1 * this.numerator,
      this.denominator).canonicalForm()
  }

  multiplicativeInverse (that) {
    return new FsRational(
      this.denominator,
      this.numerator).canonicalForm()
  }

  integerPower (n) {
    n = parseInt(n)
    if (n === 0) {
      return new FsInteger(1)
    } else if (n > 0) {
      return new FsRational(
        Math.pow(this.numerator, n),
        Math.pow(this.denominator, n)).canonicalForm()
    } else {
      return new FsRational(
        Math.pow(this.denominator, n),
        Math.pow(this.numerator, n)).canonicalForm()
    }
  }

  asReal () {
    return new FsReal(this.numerator / this.denominator)
  }

  static isStringRep (str) {
    return str && str.match(FsRational.#regex) !== null
  }
}

export class FsInteger {
  static #regex = /^[+-]?\d+$/
  #value

  constructor (v) {
    this.#value = parseInt(v)
  }

  get value () {
    return this.#value
  }

  static isStringRep (str) {
    return str.match(FsInteger.#regex) !== null
  }

  equals (target) {
    return this.value === target.value
  }

  toString () {
    return '' + this.#value
  }
}

export class FsPredicateInteger {
  static proc (list) {
    const t = list.at(0)
    return t instanceof FsInteger ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}
