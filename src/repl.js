// REPL tool
'use strict'
import FS from 'fs'
import PromptSync from 'prompt-sync'
import log from 'loglevel'

import { FizzBuzzScheme as FBS } from '../src/index.js'

log.setLevel('info')

const promptSync = PromptSync({ sigint: true })

function loadSamples (fbs) {
  try {
    FS.readdirSync('sample').forEach(file => {
      const data = FS.readFileSync('sample/' + file, 'utf8')
      console.log('read:' + data)
      fbs.eval(data)
    })
  } catch (err) {
    console.error(err)
  }
}

let loop = true
let fbs = new FBS()
while (loop) {
  const exp = promptSync('fbs>')
  if (exp === '') {
    // do nothing
  } else if (exp === 'clear') {
    fbs = new FBS()
  } else if (exp === 'samples') {
    loadSamples(fbs)
  } else if (exp === 'd') {
    fbs.enableDebugMode()
    fbs.eval('(define fib (lambda (n) (if (< n 2) n (+ (fib (- n 2)) (fib (- n 1))))))')
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
