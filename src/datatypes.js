'use strict'
import log from 'loglevel'

import { FsException } from './common.js'
import { FsSExp } from './sexpbase.js'
import { ensureListContainsOnlyTypeOf } from './sexputils.js'

export function canBeTreatedAsComplex (t) {
  return t !== null && (t instanceof FsInteger || t instanceof FsRational || t instanceof FsReal || t instanceof FsComplex)
}

export function canBeTreatedAsReal (t) {
  return t !== null && (t instanceof FsInteger || t instanceof FsRational || t instanceof FsReal)
}

export function canBeTreatedAsRational (t) {
  return t !== null && (t instanceof FsInteger || t instanceof FsRational)
}

export class FsNotANumberException extends FsException {
  constructor (n) {
    super('number is expected but got ' + n)
  }
}
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

    equals (that) {
      return that !== null && that !== undefined &&
      that instanceof FsBoolean && that.value === this.value
    }

    toString () {
      return this.value ? '#t' : '#f'
    }
}

export class FsChar {
  #value
  constructor (v) {
    this.#value = v
  }

  get value () {
    return this.#value
  }

  static isFsChar (s) {
    return (s.charAt(0) === '#' && s.charAt(1) === '\\' &&
    (s.length === 3 || s === '#\\space' || s === '#\\newline'))
  }

  static fromString (s) {
    // s is previously checked its format.
    switch (s) {
      case '#\\space':
        return new FsChar(' ')
      case '#\\newline':
        return new FsChar('\\n')
      default:
        // single character
        return new FsChar(s.charAt(2))
    }
  }

  toLower () {
    return new FsChar(this.#value.toLower())
  }

  toUpper () {
    return new FsChar(this.#value.toUpper())
  }

  equals (that) {
    return that !== null && that !== undefined &&
    that instanceof FsChar && this.#value === that.value
  }

  gt (that) {
    return that !== null && that !== undefined &&
    that instanceof FsChar && this.#value > that.value
  }

  gte (that) {
    return that !== null && that !== undefined &&
    that instanceof FsChar && this.#value >= that.value
  }

  lt (that) {
    return that !== null && that !== undefined &&
    that instanceof FsChar && this.#value < that.value
  }

  lte (that) {
    return that !== null && that !== undefined &&
    that instanceof FsChar && this.#value <= that.value
  }

  toString () {
    switch (this.#value) {
      case ' ':
        return '#\\space'
      case '\n':
        return '#\\newline'
      default:
        return '#\\' + this.#value
    }
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

export class FsString {
  #value
  constructor (value) {
    this.#value = value
  }

  get value () {
    return this.#value
  }

  equals (that) {
    if (that === null || that === undefined || !(that instanceof FsString)) {
      return false
    }
    return this.#value === that.value
  }

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
  static #regex = /^[+-]?\d+(\.\d+)?[+-]?\d?(\.\d+)?i?$/
  #real
  #imaginary

  constructor (real, imaginary) {
    this.#real = real
    this.#imaginary = imaginary
  }

  clone () {
    return new FsComplex(this.#real, this.#imaginary)
  }

  static isStringRep (str) {
    if (!str || str.match(FsComplex.#regex) === null) {
      return false
    }
    return str.match(FsComplex.#regex) !== null
  }

  get real () {
    return this.#real
  }

  get imaginary () {
    return this.#imaginary
  }

  get isExact () {
    return false
  }

  static fromString (str) {
    const hasPositiveImaginaryPart = str.indexOf('+') > 0
    const [a, b] = hasPositiveImaginaryPart ? str.split('+') : str.split('-')
    if (b === undefined || parseFloat(b) === 0) {
      return new FsReal(a)
    } else {
      const r = parseFloat(a)
      const im = parseFloat(b.replace('i', ''))
      return hasPositiveImaginaryPart ? new FsComplex(r, im) : new FsComplex(r, -1.0 * im)
    }
  }

  // math +-*/

  abs () {
    return new FsReal(Math.sqrt(this.#real * this.#real + this.#imaginary * this.#imaginary))
  }

  add (c) {
    if (canBeTreatedAsReal(c)) {
      return new FsComplex(this.#real + c.value, this.#imaginary)
    } else if (c instanceof FsComplex) {
      return new FsComplex(this.#real + c.real, this.#imaginary + c.imaginary)
    }
  }

  subtract (c) {
    if (canBeTreatedAsReal(c)) {
      return new FsComplex(this.#real - c.value, this.#imaginary)
    } else if (c instanceof FsComplex) {
      return new FsComplex(this.#real - c.real, this.#imaginary - c.imaginary)
    }
  }

  multiply (c) {
    if (canBeTreatedAsReal(c)) {
      return new FsComplex(this.#real * c.value, this.#imaginary * c.value)
    } else if (c instanceof FsComplex) {
      // (a + bi) x (c + di)
      // = (a * c - b * d) + (a * d + b * c)i
      return new FsComplex(
        this.#real * c.real - this.imaginary * c.imaginary,
        this.#real * c.imaginary + this.imaginary * c.real)
    }
  }

  additiveInverse () {
    return new FsComplex(-1.0 * this.#real, this.#imaginary)
  }

  multiplicativeInverse () {
    const zz = this.#real * this.#real + this.#imaginary + this.#imaginary
    return new FsComplex(this.#real / zz, -1.0 * this.#imaginary / zz, false)
  }

  // https://en.wikipedia.org/wiki/Argument_(complex_analysis)
  arg () {
    if (this.#real === 0 && this.#imaginary === 0) {
      // indeterminate
      return new FsReal(0)
    } else if (this.#real === 0) {
      if (this.#imaginary > 0) {
        return new FsReal(Math.PI / 2)
      } else {
        return new FsReal(-Math.PI / 2)
      }
    } else if (this.#real > 0) {
      return new FsReal(Math.atan(this.#imaginary / this.#real))
    } else {
      if (this.#imaginary >= 0) {
        return new FsReal(Math.atan(this.#imaginary / this.#real) + Math.PI)
      } else {
        return new FsReal(Math.atan(this.#imaginary / this.#real) - Math.PI)
      }
    }
  }

  log () {
    const pr = this.#real
    const pi = this.#imaginary
    return new FsComplex(Math.log(this.abs().value), Math.atan(pi / pr))
  }

  sqrt () {
    const a = this.#real
    const b = this.#imaginary
    const r = Math.sqrt((a + Math.sqrt((a * a + b * b))) / 2)
    const im = Math.sqrt((-1.0 * a + Math.sqrt((a * a + b * b))) / 2)
    if (b >= 0) {
      return new FsComplex(r, im)
    } else {
      return new FsComplex(r, -1.0 * im)
    }
  }

  equals (t) {
    return t !== null && t instanceof FsComplex &&
    t.real === this.#real && t.imaginary === this.#imaginary
  }

  toString () {
    if (this.#imaginary === 0) {
      if (Math.abs(this.#real) === Math.abs(Math.floor(this.#real))) {
        return '' + this.#real.toFixed(1)
      } else {
        return '' + this.#real
      }
    } else {
      const r = Math.abs(this.#real) === Math.abs(Math.floor(this.#real)) ? '' + this.#real.toFixed(1) : '' + this.#real
      const i = Math.abs(this.#imaginary) === Math.abs(Math.floor(this.#imaginary)) ? '' + this.#imaginary.toFixed(1) : '' + this.#imaginary
      const sign = i >= 0 ? '+' : ''
      return '' + r + sign + i + 'i'
    }
  }
}

/**
 * Real number class
 *
 * based on JavaScript Number
 */
export class FsReal {
  // TODO: Make sure the regex used here, which is vulnerable to super-linear runtime due to backtracking, cannot lead to denial of service.
  static #regex = /^(#[ei])?[+-]?(([0-9]+)?\.[0-9]+|[0-9][0-9#]*)(e[0-9]+)?$/
  #value
  #exact

  constructor (v, exact = false) {
    this.#value = parseFloat(v)
    this.#exact = exact
  }

  clone () {
    return new FsReal(this.#value)
  }

  static fromString (str) {
    if (str.startsWith('#e')) {
      return new FsReal(parseFloat(str.substr(2)), true)
    } else if (str.startsWith('#i')) {
      return new FsReal(parseFloat(str.substr(2)), false)
    } else {
      // replace # with 0, in inexact context.
      // https://stackoverflow.com/questions/10935110/meaning-of-in-scheme-number-literals
      return new FsReal(parseFloat(str.replace(/#/g, '0')), false)
    }
  }

  static isStringRep (str) {
    return str && str.match(FsReal.#regex) !== null
  }

  isExact () {
    return this.#exact
  }

  isInteger () {
    return Number.isInteger(this.#value)
  }

  get value () {
    return this.#value
  }

  // math +-*/

  add (n) {
    if (canBeTreatedAsReal(n)) {
      return new FsReal(this.value + n.value, this.isExact() && n.isExact())
    } else if (n instanceof FsComplex) {
      return n.add(this)
    } else {
      throw new FsNotANumberException(n)
    }
  }

  multiply (n) {
    if (canBeTreatedAsReal(n)) {
      return new FsReal(this.value * n.value, this.isExact() && n.isExact())
    } else if (n instanceof FsComplex) {
      return n.multiply(this)
    } else {
      throw new FsNotANumberException(n)
    }
  }

  devide (n) {
    if (canBeTreatedAsReal(n)) {
      return new FsReal(this.value * n.value, this.isExact() && n.isExact())
    } else if (n instanceof FsComplex) {
      return n.multiplicativeInverse().multiply(this)
    } else {
      throw new FsNotANumberException(n)
    }
  }

  abs () {
    return new FsReal(Math.abs(this.#value))
  }

  additiveInverse () {
    return new FsReal(-1.0 * this.#value, this.#exact)
  }

  multiplicativeInverse () {
    return new FsReal(1.0 / this.#value, false)
  }

  equals (t) {
    return t !== null && t instanceof FsReal && t.value === this.#value
  }

  toString () {
    return this.isInteger() ? '' + this.#value.toFixed(1) : this.#value
  }
}

export function gcd (a, b) {
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

export function lcm (a, b) {
  if (a > b) {
    return Math.abs(a / gcd(a, b) * b)
  } else {
    return Math.abs(b / gcd(a, b) * a)
  }
}
export class FsRational {
  static #regex = /^[+-]?[0-9]+\/[0-9]+$/
  #numerator
  #denominator
  #exact

  /**
   * Rational number p/q
   * p ... numerator
   * q ... denominator
   *
   * @param {*} numerator
   * @param {*} denominator
   */
  constructor (numerator, denominator, exact = true) {
    this.#numerator = parseInt(numerator)
    this.#denominator = parseInt(denominator)
    if (exact) {
      this.#exact = Number.MIN_SAFE_INTEGER <= numerator &&
      numerator <= Number.MAX_SAFE_INTEGER &&
      Number.MIN_SAFE_INTEGER <= denominator &&
      denominator <= Number.MAX_SAFE_INTEGER
    }
  }

  clone () {
    return new FsRational(this.#numerator, this.#denominator)
  }

  static fromString (str) {
    const [a, b] = str.split('/')
    return new FsRational(a, b).canonicalForm()
  }

  get numerator () {
    return this.#numerator
  }

  get denominator () {
    return this.#denominator
  }

  isExact () {
    return this.#exact
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

  // math +-*/

  add (that) {
    if (that instanceof FsInteger) {
      return new FsRational(
        this.numerator + this.denominator * that.value,
        this.denominator).canonicalForm()
    } else if (that instanceof FsRational) {
      return new FsRational(
        this.numerator * that.denominator + this.denominator * that.numerator,
        this.denominator * that.denominator).canonicalForm()
    } else if (that instanceof FsReal || that instanceof FsComplex) {
      return that.add(this)
    } else {
      throw new FsNotANumberException(that)
    }
  }

  subtract (that) {
    if (that instanceof FsInteger) {
      return new FsRational(
        this.numerator - this.denominator * that.value,
        this.denominator).canonicalForm()
    } else if (that instanceof FsRational) {
      return new FsRational(
        this.numerator * that.denominator - this.denominator * that.numerator,
        this.denominator * that.denominator).canonicalForm()
    } else if (that instanceof FsReal || that instanceof FsComplex) {
      return that.subtract(this)
    } else {
      throw new FsNotANumberException(that)
    }
  }

  multiply (that) {
    if (that instanceof FsInteger) {
      return new FsRational(
        this.numerator * that.value,
        this.denominator).canonicalForm()
    } else if (that instanceof FsRational) {
      return new FsRational(
        this.numerator * that.denominator + this.denominator * that.numerator,
        this.denominator * that.denominator).canonicalForm()
    } else if (that instanceof FsReal || that instanceof FsComplex) {
      return that.add(this)
    } else {
      throw new FsNotANumberException(that)
    }
  }

  devide (that) {
    return new FsRational(
      this.numerator * that.denominator,
      this.denominator * that.numerator).canonicalForm()
  }

  abs () {
    return new FsRational(Math.abs(this.#numerator), this.#denominator, this.#exact)
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

  get value () {
    return this.numerator / this.denominator
  }

  static isStringRep (str) {
    return str && str.match(FsRational.#regex) !== null
  }

  isInteger () {
    return this.#numerator % this.#denominator === 0
  }

  equals (t) {
    if (t === null || !(t instanceof FsRational)) {
      return false
    }
    const canonicalT = t.canonicalForm()
    const canonicalSelf = this.canonicalForm()
    return canonicalT.numerator === canonicalSelf.#numerator &&
    canonicalT.denominator === canonicalSelf.#denominator
  }

  toString () {
    const s = this.#numerator + '/' + this.#denominator
    return this.#exact ? s : '#i' + s
  }
}

export class FsInteger {
  static #regex = /^(#[ei])?(#[bode])?[+-]?([0-9][0-9#]*)(e[0-9]+)?$/
  #value
  #exact

  constructor (v, exact = true) {
    this.#value = parseInt(parseFloat(v)) // to parse number with exp() expression
    if (Number.MIN_SAFE_INTEGER <= v && v <= Number.MAX_SAFE_INTEGER) {
      this.#exact = false
    }
  }

  clone () {
    return new FsInteger(this.#value)
  }

  get value () {
    return this.#value
  }

  isExact () {
    return this.#exact
  }

  static isStringRep (str) {
    return str.match(FsInteger.#regex) !== null
  }

  static fromString (str) {
    if (str.startsWith('#e')) {
      if (str.startsWith('#e#b')) {
        return new FsInteger(parseInt(str.substr(4).replace(/#/g, '0'), 2))
      } else if (str.startsWith('#e#o')) {
        return new FsInteger(parseInt(str.substr(4).replace(/#/g, '0'), 8))
      } else if (str.startsWith('#e#d')) {
        return new FsInteger(parseInt(str.substr(4).replace(/#/g, '0'), 10))
      } else if (str.startsWith('#e#x')) {
        return new FsInteger(parseInt(str.substr(4).replace(/#/g, '0'), 16))
      } else {
        return new FsInteger(str.substr(2))
      }
    } else if (str.startsWith('#i')) {
      if (str.startsWith('#i#b')) {
        return FsReal.fromString(parseInt(str.substr(4).replace(/#/g, '0'), 2))
      } else if (str.startsWith('#i#o')) {
        return FsReal.fromString(parseInt(str.substr(4).replace(/#/g, '0'), 8))
      } else if (str.startsWith('#i#d')) {
        return FsReal.fromString(parseInt(str.substr(4).replace(/#/g, '0'), 10))
      } else if (str.startsWith('#i#x')) {
        return FsReal.fromString(parseInt(str.substr(4).replace(/#/g, '0'), 16))
      } else {
        return FsReal.fromString(str.substr(2).replace(/#/g, '0'))
      }
    } else {
      if (str.match(/e[0-9]+$/)) {
        return new FsReal(str.replace(/#/g, '0'))
      } else {
        return new FsInteger(str.replace(/#/g, '0'))
      }
    }
  }

  // math +-*/

  add (n) {
    if (n instanceof FsInteger) {
      return new FsInteger(this.#value + n.#value, this.isExact() && n.isExact())
    } else if (canBeTreatedAsComplex(n)) {
      return n.add(this)
    } else {
      throw new FsNotANumberException(n)
    }
  }

  subtract (n) {
    if (!canBeTreatedAsComplex(n)) {
      throw new FsNotANumberException(n)
    }
    return this.add(n.addtiveInverse())
  }

  multiply (n) {
    if (n instanceof FsInteger) {
      return new FsInteger(this.#value * n.#value, this.isExact() && n.isExact())
    } else if (canBeTreatedAsComplex(n)) {
      return n.multiply(this)
    } else {
      throw new FsNotANumberException(n)
    }
  }

  devide (n) {
    if (n === 0) {
      throw new FsException('devide by 0')
    }
    if (n instanceof FsInteger) {
      return new FsRational(this.#value, n.#value, this.isExact() && n.isExact())
    } else if (canBeTreatedAsComplex(n)) {
      return this.multiply(n.multiplicativeInverse())
    }
  }

  abs () {
    return new FsInteger(Math.abs(this.#value))
  }

  additiveInverse () {
    return new FsInteger(-1 * this.#value, this.#exact)
  }

  multiplicativeInverse () {
    if (this.#value === 0) {
      throw new FsException('devide by 0')
    } else if (this.#value === 1) {
      return new FsInteger(1)
    }
    return new FsRational(1, this.value, this.#exact)
  }

  equals (t) {
    return t !== null && t instanceof FsInteger && t.value === this.#value
  }

  toString () {
    return '' + this.#value
  }

  toStringWithRadix (radix) {
    return this.#value.toString(radix)
  }
}

// predicates
export class FsPredicateComplex {
  static proc (list) {
    const t = list.at(0)
    return (t instanceof FsComplex || t instanceof FsReal ||
      t instanceof FsRational || t instanceof FsInteger)
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}
export class FsPredicateInteger {
  static proc (list) {
    const t = list.at(0)
    return t instanceof FsInteger ||
    (t instanceof FsReal && t.isInteger()) ||
    (t instanceof FsRational && t.isInteger())
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FsPredicateReal {
  static proc (list) {
    const t = list.at(0)
    return (t instanceof FsReal || t instanceof FsRational ||
      t instanceof FsInteger)
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FsPredicateRational {
  static proc (list) {
    const t = list.at(0)
    return (t instanceof FsRational || t instanceof FsInteger) ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

// char

export class FspChar {
  static proc (list) {
    ensureListContainsOnlyTypeOf(list, FsChar)
    const t = list.at(0)
    return new FsInteger(t.value.charCodeAt(0))
  }
}

export class FspCharToInteger {
  static proc (list) {
    ensureListContainsOnlyTypeOf(list, FsChar)
    const t = list.at(0)
    return new FsInteger(t.value.charCodeAt(0))
  }
}
