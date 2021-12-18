'use strict'

/** Represents a Scheme "Error" */
export class FsException {
  constructor (message, innerException = null) {
    this.message = message
    this.name = 'FsException'
    this.innerException = innerException
    this.stack = (new Error()).stack
  }

  toString () {
    return `${this.name}: "${this.message}"`
  }
}

/** Represents a system error */
export class FsError extends Error {
  constructor (message, innerException = null) {
    super(message)
    this.name = 'FsError'
    this.innerException = innerException
    this.stack = (new Error()).stack
  }

  toString () {
    return `${this.name}: "${this.message}"`
  }
}
