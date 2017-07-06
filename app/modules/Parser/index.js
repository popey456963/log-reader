const apache_descriptors = require('./apache_descriptors')
const describe = require('./describe')

const Event_Emitter = require('events')
class Emitter extends Event_Emitter{}
const Line_Parser = new Emitter()

let descriptors = apache_descriptors.concat(describe.default)

// From a line, finds a matching descriptor.
function getDescriptor(line) {
  for (let descriptor of descriptors) {
    if (descriptor.match(line)) {
      return descriptor
    }
  }
}

// From a descriptor and a line, unpacks all variables into an object.
function getData(descriptor, line) {
  let match = line.match(descriptor.regex)
  let matchings = {}

  for (let i = 1; i < match.length; i++) {
    matchings[descriptor.has[i - 1]] = match[i]
  }

  return {
    matchings,
    type: descriptor.name,
    display: descriptor.display(matchings)
  }
}

// On receiving a 'parse' event, emit parsed data of a line to all specified channels.
Line_Parser.on('parse', (line) => {
  let descriptor = getDescriptor(line)
  let data = getData(descriptor, line)

  for (let channel of descriptor.channels.concat(['all'])) {
    Line_Parser.emit(channel, data)
  }
})

module.exports = Line_Parser
