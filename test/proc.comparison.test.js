'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsBoolean } from '../src/datatypes.js'

test('evaluating (< 0 1) yields #t', () => {
  const code = '(< 0 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(true))
})

test('evaluating (< 1 0) yields #f', () => {
  const code = '(< 1 0)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(false))
})

test('evaluating (< 1 1) yields #f', () => {
  const code = '(< 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(false))
})

// <=

test('evaluating (<= 0 1) yields #t', () => {
  const code = '(<= 0 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(true))
})

test('evaluating (<= 1 0) yields #f', () => {
  const code = '(<= 1 0)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(false))
})

test('evaluating (<= 1 1) yields #t', () => {
  const code = '(<= 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(true))
})

// >

test('evaluating (> 0 1) yields #f', () => {
  const code = '(> 0 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(false))
})

test('evaluating (> 1 0) yields #t', () => {
  const code = '(> 1 0)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(true))
})

test('evaluating (> 1 1) yields #f', () => {
  const code = '(> 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(false))
})

// >=

test('evaluating (>= 0 1) yields #f', () => {
  const code = '(>= 0 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(false))
})

test('evaluating (>= 1 0) yields #t', () => {
  const code = '(>= 1 0)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(true))
})

test('evaluating (>= 1 1) yields #t', () => {
  const code = '(>= 1 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsBoolean(true))
})
