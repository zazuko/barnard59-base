import { strictEqual } from 'assert'
import { array } from 'get-stream'
import { isDuplex } from 'isstream'
import { describe, it } from 'mocha'
import { Readable } from 'readable-stream'
import size from '../size.js'

describe('size', () => {
  it('should be a function', () => {
    strictEqual(typeof size, 'function')
  })

  it('should return a duplex', () => {
    const s = size({})
    strictEqual(isDuplex(s), true)
  })

  it('should pipe object Mode = true', async () => {
    const s = size({
      interval: 1,
      stdout: { write () {} }
    })
    const stream = new Readable({
      objectMode: true,
      read: () => {}
    })
    stream.pipe(s)
    stream.push('A very long string?')
    stream.push(null)
    strictEqual((await array(s)).length, 1)
  })

  it('should pipe object Mode = false', async () => {
    const s = size({
      interval: 1,
      stdout: { write () {} }
    })
    const stream = new Readable({
      objectMode: false,
      read: () => {}
    })
    stream.pipe(s)
    stream.push('A very long string?')
    stream.push(null)
    strictEqual((await array(s)).length, 1)
  })
})
