import { obj } from 'through2'

export default function map (func) {
  const context = this
  return obj(function (chunk, encoding, callback) {
    Promise.resolve()
      .then(() => {
        return func.call(context, chunk, encoding)
      }).then((result) => {
        this.push(result)

        callback()
      }).catch(callback)
  })
}
