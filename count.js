import { PassThrough } from 'stream'

function count () {
  const t = new PassThrough({
    objectMode: true,
    write (chunk, encoding, callback) {
      this.push(chunk)
      t.count++
      callback()
    }
  })

  t.count = 0

  return t
}

export default count
