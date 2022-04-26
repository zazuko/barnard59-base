import { strictEqual } from 'assert'
import { array } from 'get-stream'
import { isDuplex } from 'isstream'
import { describe, it } from 'mocha'
import { Readable } from 'readable-stream'
import { log, logObject } from '../monitor.js'

describe('log', () => {
  it('should be a function', () => {
    strictEqual(typeof log, 'function')
  })

  it('should return a duplex', () => {
    const s = log({})
    strictEqual(isDuplex(s), true)
  })

  it('should pipe objectMode false', async () => {
    const s = log({
      objectMode: false,
      interval: 1,
      stdout: { write () {} }
    })
    const stream = new Readable({
      objectMode: false,
      read: () => {}
    })
    stream.pipe(s)
    stream.push('a')
    stream.push(null)
    strictEqual((await array(s)).length, 1)
  })
})

describe('logObject', () => {
  it('should be a function', () => {
    strictEqual(typeof logObject, 'function')
  })

  it('should return a duplex', () => {
    const s = logObject({})
    strictEqual(isDuplex(s), true)
  })

  it('should pipe objectMode true', async () => {
    const s = logObject({
      objectMode: true,
      interval: 1,
      stdout: { write () {} }
    })
    const stream = new Readable({
      objectMode: true,
      read: () => {}
    })
    stream.pipe(s)
    stream.push({})
    stream.push(null)
    strictEqual((await array(s)).length, 1)
  })
})
