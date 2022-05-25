import { PassThrough } from 'stream'

function flatten () {
  return new PassThrough({
    objectMode: true,
    write (chunk, encoding, callback) {
      if (typeof chunk[Symbol.iterator] === 'function') {
        for (const item of chunk) {
          this.push(item)
        }

        return callback()
      }

      if (typeof chunk.forEach === 'function') {
        chunk.forEach(item => this.push(item))

        return callback()
      }

      return callback(new Error('chunk doesn\'t implement Symbol.iterator or .forEach'))
    }
  })
}

export default flatten
