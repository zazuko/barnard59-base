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

  it('should pipe elements on objectMode false', async () => {
    const s = throughput({
      interval: 2,
      out: {
        write: str => {}
      }
    })
    const stringsArray = [...Array(10).keys()].map(toString)
    const stream = Readable.from(stringsArray, {
      objectMode: false
    })
    stream.pipe(s)
    strictEqual((await array(s)).length, 10)
  })

  it('should pipe elements on objectMode true', async () => {
    const s = throughput({
      interval: 2,
      out: {
        write: str => {}
      }
    })
    const objectsArray = [...Array(10).keys()].map(number => {
      return { number: number }
    })
    const stream = Readable.from(objectsArray, {
      objectMode: true
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
    const s = throughput({
      interval: 2,
      out: spy
    })
    const stream = Readable.from([...Array(10).keys()].map(toString), {
      objectMode: true
    })
    stream.pipe(s)
    await array(s)
    strictEqual(seen.length > 0, true)
  })
})
