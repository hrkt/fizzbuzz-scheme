'use strict'

import { FsError } from './common.js'

export class FsSExp {
  constructor (value = null) {
    if (this.constructor === FsSExp) {
      throw new FsError('FsSexp class can\'t be instantiated.')
    }
  }

  get type () {
    return 'fssexp'
  }

  equals (that) {
    // used in expect .toBe()
    return undefined !== that && (this.value === that.value)
  }

  toString () {
    return this.constructor.name
  }
}

export class FsAtom extends FsSExp {
  constructor (value = null) {
    super()
    if (this.constructor === FsAtom) {
      throw new FsError('FsAtom class can\'t be instantiated.')
    }
    this.value = value
  }

  toString () {
    return this.value === null ? 'null' : this.value.toString()
  }
}
