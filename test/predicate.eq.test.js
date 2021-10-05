'use strict'

import { FsException } from '../src/common.js'
import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (eq? 1) throws exception', () => {
  expect(() => { new FBS().eval('(eq? 1)') }).toThrow(FsException)
})

test('evaluating (eq? (list 1) (list 1)) yields #f', () => {
  expect(new FBS().eval('(eq? (list 1) (list 1))')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (eq? \'a \'a) yields #t', () => {
  expect(new FBS().eval('(eq? \'a \'a)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (eq? \'(a) \'(a)) yields #f', () => {
  expect(new FBS().eval('(eq? \'(a) \'(a))')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (eq? y y) throws exception, unbound', () => {
  expect(() => { new FBS().eval('(eq? y y)') }).toThrow(FsException)
})

test('evaluating (let ((x (list \'a))) (eq? x x)) yields #f, unbound', () => {
  expect(new FBS().eval('(let ((x (list \'a))) (eq? x x))')).toStrictEqual(FsBoolean.TRUE)
})
