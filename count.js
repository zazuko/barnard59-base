import through from 'through2'

function count () {
  const t = through.obj(function (chunk, encoding, callback) {
    this.push(chunk)
    t.count++
    callback()
  })

  t.count = 0

  return t
}

export default count
