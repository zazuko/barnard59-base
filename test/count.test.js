import { strictEqual } from 'assert'
import { array } from 'get-stream'
import { isDuplex } from 'isstream'
import { describe, it } from 'mocha'
import { Readable } from 'readable-stream'
import count from '../count.js'

describe('count', () => {
  it('should be a function', () => {
    strictEqual(typeof count, 'function')
  })

  it('should return a duplex', () => {
    const s = count({})
    strictEqual(isDuplex(s), true)
  })

  it('should expose count variable, with object Mode = true', async () => {
    const s = count({
      interval: 1,
      stdout: { write () {} }
    })
    const stream = new Readable({
      objectMode: true,
      read: () => {}
    })
    stream.pipe(s)
    stream.push('A very long string?')
    stream.push('and a small one')
    stream.push(null)
    strictEqual((await array(s)).length, 2)
    strictEqual(s.count, 2)
  })

  it('should expose count variable, with object Mode = false', async () => {
    const s = count({
      interval: 1,
      stdout: { write () {} }
    })
    const stream = new Readable({
      objectMode: false,
      read: () => {}
    })
    stream.pipe(s)
    stream.push('A very long string?')
    stream.push('and a small one')
    stream.push(null)
    strictEqual((await array(s)).length, 2)
    strictEqual(s.count, 2)
  })
})
