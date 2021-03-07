import stream from 'readable-stream'

const { Transform } = stream

class CsvParser extends Transform {
  constructor () {
    super({ readableObjectMode: true })

    this.content = ''
  }

  _transform (chunk, encoding, callback) {
    this.content += chunk.toString()

    this.nextLine()

    callback()
  }

  _flush (callback) {
    if (this.content) {
      this.pushLine(this.content)
    }

    callback()
  }

  nextLine () {
    const index = this.content.indexOf('\n')

    if (index === -1) {
      return
    }

    this.pushLine(this.content.substring(0, index))
    this.content = this.content.substring(index + 1)
    this.nextLine()
  }

  pushLine (line) {
    this.push(line.split(','))
  }
}

function factory () {
  return new CsvParser()
}

export default factory
