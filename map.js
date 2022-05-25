import { PassThrough } from 'stream'

function map (func) {
  const context = this

  return new PassThrough({
    objectMode: true,
    write (chunk, encoding, callback) {
      Promise.resolve()
        .then(() => {
          return func.call(context, chunk, encoding)
        }).then(result => {
          this.push(result)

          callback()
        }).catch(callback)
    }
  })
}

export default map
