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

  it('should pipe object Mode = false', async () => {
    const s = size({
      interval: 1,
      out: { write () {} }
    })

    const stream = Readable.from(['a', 'b'], {
      objectMode: false
    })
    stream.pipe(s)
    strictEqual((await array(s)).length, 2)
  })

  it('should pipe object Mode = true', async () => {
    const s = size({
      interval: 2,
      out: { write () {} }
    })

    const stream = Readable.from(['a', 'b'], {
      objectMode: true
    })
    stream.pipe(s)
    strictEqual((await array(s)).length, 2)
  })
})
