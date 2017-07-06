const describe = require('./describe')

describe('request').matches(
  /^(\S+) \S+ \S+ \[([^\]]+)\] "([A-Z]+) ([^ "]*) ([^"]*)" (\d+) (\d+) "([^"]*)" "([^"]*)"$/
).has(
  'ip', 'date', 'method', 'url', 'protocol', 'status', 'data_length', 'referrer'
).displayed_as(
  '> ${o.ip} ${o.url}'
).enable()

module.exports = describe().get_matchings()
