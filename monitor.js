import { cursorTo, clearLine } from 'readline'
import through from 'through2'

function logInterval ({
  interval,
  objectMode,
  label,
  stdout
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
      cursorTo(stdout, 0)
      stdout.write(str)
      clearLine(stdout, 1)
    }
    setTimeout(update, interval)
  }

  const push = function (chunk, encoding, callback) {
    if (!started) {
      stdout.write(`[${label}] first at: ${new Date()}\n`)
      started = true
      update()
    }
    this.push(chunk)
    count++
    callback()
  }
  return objectMode ? through.obj(push) : through(push)
}

function monitor ({
  interval = 1000,
  label = 'monitor',
  stdout = process.stdout
}) {
  return logInterval({
    interval,
    objectMode: false,
    label,
    stdout
  })
}

function objectMonitor ({
  interval = 1000,
  label = 'objectMonitor',
  stdout = process.stdout
}) {
  return logInterval({
    interval,
    objectMode: true,
    label,
    stdout
  })
}

export { monitor, objectMonitor }
