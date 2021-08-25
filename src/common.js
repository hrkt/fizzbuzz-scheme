'use strict'

// export class FsException {
//   constructor (message) {
//     this.message = message
//     this.name = 'FsException'
//   }

//   toString () {
//     return `${this.name}: "${this.message}"`
//   }
// }

export class FsError extends Error {
  constructor (message) {
    super(message)
    this.name = 'FsError'
  }

  toString () {
    return `${this.name}: "${this.message}"`
  }
}
