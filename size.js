import { cursorTo, clearLine } from 'readline'
import through from 'through2'

function size ({
  interval,
  label,
  stdout
}) {
  let bytes = 0
  let lastBytes = 0
  let started = false

  const update = () => {
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

      cursorTo(stdout, 0)
      stdout.write(str)
      clearLine(stdout, 1)
    }

    setTimeout(update, interval)
  }

  return through.obj(function (chunk, encoding, callback) {
    if (!started) {
      stdout.write(`[${label}][start] ${new Date()}\n`)
      started = true
      update()
    }

    this.push(chunk)
    bytes += chunk.length
    callback()
  })
}

function factory ({
  interval = 1000,
  label = 'size',
  stdout = process.stdout
}) {
  return size({
    interval,
    label,
    stdout
  })
}

export default factory
