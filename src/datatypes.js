'use strict'
import log from 'loglevel'

import { FsException } from './common.js'
import { FsAtom, FsSExp } from './sexpbase.js'

export class FsBoolean extends FsAtom {
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

export class FsNumber extends FsAtom {
  toString () {
    return '' + this.value
  }

  equals (target) {
    return this.value === target.value
  }

  get type () {
    return 'fsnumber'
  }
}

export class FsChar extends FsAtom {
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

export class FsString extends FsAtom {
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

    static proc (arg) {
      return arg.length === 0 ? FsList.EMPTY : new FsList(arg.value)
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
            buf += this.value[i].toString()
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
