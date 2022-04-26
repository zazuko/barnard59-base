import { strictEqual } from 'assert'
import { array } from 'get-stream'
import { isDuplex } from 'isstream'
import { describe, it } from 'mocha'
import { Readable } from 'readable-stream'
import { monitor, objectMonitor } from '../monitor.js'

describe('monitor', () => {
  it('should be a function', () => {
    strictEqual(typeof monitor, 'function')
  })

  it('should return a duplex', () => {
    const s = monitor({})
    strictEqual(isDuplex(s), true)
  })

  it('should pipe objectMode false', async () => {
    const s = monitor({
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

describe('objectMonitor', () => {
  it('should be a function', () => {
    strictEqual(typeof objectMonitor, 'function')
  })

  it('should return a duplex', () => {
    const s = objectMonitor({})
    strictEqual(isDuplex(s), true)
  })

  it('should pipe objectMode true', async () => {
    const s = objectMonitor({
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
