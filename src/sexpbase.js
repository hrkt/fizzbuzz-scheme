'use strict'

import { FsError } from './common.js'

export class FsSExp {
  constructor (value = null) {
    if (this.constructor === FsSExp) {
      throw new FsError('FsSexp class can\'t be instantiated.')
    }
    this.value = value
  }

  get type () {
    return 'fssexp'
  }

  equals (that) {
    // used in expect .toBe()
    return undefined !== that && (this.value === that.value)
  }

  toString () {
    return this.value === null ? 'null' : this.value.toString()
  }
}
