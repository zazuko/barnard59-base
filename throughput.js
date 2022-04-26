import { cursorTo, clearLine } from 'readline'
import through from 'through2'

function throughput ({
  interval,
  label,
  out
}) {
  let count = 0
  let lastCount = 0
  let started = false

  const timeUnit = interval === 1000 ? ' per second' : `/${interval} ms`

  function update () {
    if (count) {
      if (lastCount === count) {
        return
      }

      const str = `[${label}] count: ${count} (${(count - lastCount)}${timeUnit})`
      lastCount = count
      cursorTo(out, 0)
      out.write(str)
      clearLine(out, 1)
    }
    setTimeout(update, interval)
  }

  const push = function (chunk, encoding, callback) {
    if (!started) {
      out.write(`[${label}][start] ${new Date()}\n`)
      started = true
      update()
    }
    this.push(chunk)
    count++
    callback()
  }
  return through.obj(push)
}

function factory ({
  interval = 1000,
  label = 'throughput',
  out = process.stdout
}) {
  return throughput({
    interval,
    label,
    out
  })
}

export default factory
