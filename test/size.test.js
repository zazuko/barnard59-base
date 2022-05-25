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

  it('should pipe elements on objectMode false', async () => {
    const stringsArray = [...Array(10).keys()].map(toString)
    const stream = Readable.from(stringsArray, {
      objectMode: false
    })

    const s = size({
      interval: 2,
      out: {
        write: str => {}
      }
    })

    stream.pipe(s)
    strictEqual((await array(s)).length, 10)
  })

  it('should write in the console', async () => {
    const seen = []
    const spy = {
      write: str => {
        seen.push(str)
      }
    }
    const stream = Readable.from([...Array(10).keys()].map(toString), {
      objectMode: true
    })

    const s = size({
      interval: 2,
      out: spy
    })

    stream.pipe(s)
    await array(s)
    strictEqual(seen.length > 0, true)
  })
})
