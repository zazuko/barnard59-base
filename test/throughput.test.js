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
      out: { write () {} }
    })
    const stream = Readable.from(['a', 'b'], {
      objectMode: true
    })
    stream.pipe(s)
    strictEqual((await array(s)).length, 2)
  })
})
