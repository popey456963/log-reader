// Provides a wrapper for parsing files, lines and watching files.
const byline = require('byline')
const Tail = require('file-tail')
const fs = require('fs')

const Line_Parser = require('../Parser')

Line_Parser.parseFile = function(file_name) {
  let stream = byline(fs.createReadStream(file_name, { encoding: 'utf8' }))

  stream.on('data', async (line) => {
    Line_Parser.emit('parse', line)
  })
}

Line_Parser.parseLine = function(line) {
  Line_Parser.emit('parse', line)
}

Line_Parser.watchFile = function(file_name) {
  let tail = Tail.startTailing(file_name)

  tail.on('line', (line) => {
    Line_Parser.emit('parse', line)
  })

  tail.on('error', (error) => {
    console.error(error)
  })
}

module.exports = Line_Parser
