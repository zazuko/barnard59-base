import { strictEqual } from 'assert'
import { array } from 'get-stream'
import { isDuplex } from 'isstream'
import { describe, it } from 'mocha'
import { Readable } from 'readable-stream'
import throughput from '../throughput.js'

describe('throughput', () => {
  it('should be a function', () => {
    strictEqual(typeof throughput, 'function')
  })

  it('should return a duplex', () => {
    const s = throughput({})
    strictEqual(isDuplex(s), true)
  })

  it('should pipe elements on objectMode true', async () => {
    const s = throughput({
      interval: 1,
      stdout: { write () {} }
    })
    const stream = new Readable({
      objectMode: true,
      read: () => {}
    })
    stream.pipe(s)
    stream.push('a')
    stream.push(null)
    strictEqual((await array(s)).length, 1)
  })

  it('should pipe elements on objectMode false', async () => {
    const s = throughput({
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
