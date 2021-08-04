'use strict'

export class FsException {
  constructor (message) {
    this.message = message
    this.name = 'FsException'
  }

  toString () {
    return `${this.name}: "${this.message}"`
  }
}
