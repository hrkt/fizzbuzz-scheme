'use strict'

import { FsBoolean, FsInteger, FsList } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating slicing list', () => {
  const list = new FsList([1, 2, 3])
  expect(list.slice(1)).toStrictEqual(new FsList([2, 3]))
})

test('evaluating (list 1 2) yields (1 2)', () => {
  const code = '(list 1 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsList([new FsInteger(1), new FsInteger(2)]))
})

test('evaluating (list? ()) yields #t', () => {
  const code = '(list? ())'
  expect(new FBS().eval(code)).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (list? (list 1 2)) yields #t', () => {
  const code = '(list? (list 1 2))'
  expect(new FBS().eval(code)).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (list? 1) yields #f', () => {
  const code = '(list? 1)'
  expect(new FBS().eval(code)).toStrictEqual(FsBoolean.FALSE)
})
