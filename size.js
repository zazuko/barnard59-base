import { cursorTo, clearLine } from 'readline'
import { PassThrough } from 'stream'

function size ({
  interval,
  label,
  out
}) {
  let bytes = 0
  let lastBytes = 0
  let started = false

  function update () {
    if (bytes) {
      if (lastBytes === bytes) {
        return
      }

      let number = bytes
      let unit = 'bytes'

      if (number > 1024) {
        number /= 1024
        unit = 'kb'
      }

      if (number > 1024) {
        number /= 1024
        unit = 'mb'
      }

      if (number > 1024) {
        number /= 1024
        unit = 'gb'
      }

      const str = `[${label}] ${(Math.floor(number * 100) / 100)} ${unit}`

      lastBytes = bytes

      cursorTo(out, 0)
      out.write(str)
      clearLine(out, 1)
    }

    setTimeout(update, interval)
  }

  return new PassThrough({
    objectMode: false,
    write (chunk, encoding, callback) {
      if (!chunk.length) {
        throw new Error(`cannot determine the size of an instance of ${chunk?.constructor?.name}`)
      }

      bytes += chunk.length

      if (!started) {
        out.write(`[${label}][start] ${new Date()}\n`)
        started = true
        update()
      }

      this.push(chunk)
      callback()
    },
    flush (callback) {
      out.write(`[${label}][end] ${new Date()}\n`)
      callback()
    }
  })
}

function factory ({
  interval = 1000,
  label = 'size',
  out = process.stdout
}) {
  return size({
    interval,
    label,
    out
  })
}

export default factory
