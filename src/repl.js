// REPL tool
'use strict'
import log from 'loglevel'
import PromptSync from 'prompt-sync'

import { FizzBuzzScheme as FBS } from '../src/index.js'

log.setLevel('info')

const promptSync = PromptSync({ sigint: true })

let loop = true
let fbs = new FBS()
while (loop) {
  const exp = promptSync('fbs> ')
  if (exp === '') {
    // do nothing
  } else if (exp === 'clear') {
    fbs = new FBS()
  } else if (exp === 'd') {
    fbs.enableDebugMode()
    // fbs.eval('(define fib (lambda (n) (if (< n 2) n (+ (fib (- n 2)) (fib (- n 1))))))')
  } else if (exp === 'q') {
    console.log('bye.')
    loop = false
  } else {
    try {
      const res = fbs.eval(exp)
      console.log(res.toString())
    } catch (e) {
      console.log(e)
    }
  }
}
