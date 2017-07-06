matching_paths = []

let describe = function(name) {
  let object = this
  this.name = name

  this.is = function() {
    this.groups = arguments
    return object
  }

  this.matches = function(match) {
    this.match = function(o) { return match.test(o) }
    this.regex = match
    return object
  }

  this.has = function() {
    this.has_array = arguments
    return object
  }

  this.displayed_as = function(display) {
    // If string, convert to function...
    if (typeof display == 'string') {
      this.display = function(o) {
        return eval('`' + display + '`')
      }
    } else {
      this.display = display
    }
    return object
  }

  this.enable = function() {
    matching_paths.push({
      match: this.match,
      has: this.has_array,
      display: this.display,
      name: this.name,
      groups: this.groups || [],
      regex: this.regex,
      channels: [this.name].concat(this.groups || [])
    })
  }

  this.get_matchings = function() {
    return matching_paths
  }

  return object
}

describe.default = {
  match: () => { return true },
  has: ['line'],
  display: (o) => { return o.line },
  name: 'unknown',
  groups: [],
  regex: /(.*)/,
  channels: ['unknown']
}

module.exports = describe
