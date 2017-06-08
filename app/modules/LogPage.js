const { ipcRenderer, remote }   = require('electron')
const $                         = require('jquery')
const Tail                      = require('file-tail')

/* TODO
 *
 * - Damage given & taken
 * 
 */

const showconvar = false
const showlobbydata = false

const ignore = [
  /Shutdown function/,
  /GetSpriteAxes/,
  /CreateEvent:/,
  /Steamworks gamestats/,
  /Stopping All Sounds\.\.\./,
  /Avatar image for user /,
  /HRTF: Not enough data, wanted [0-9]+, got [0-9]+/,
  /Host_WriteConfiguration:/,
  /Stopping: Channel:/,
  /IME Component/,
  /Datacenter::EnableUpdate/,
  /Texture .* not found./,
  /Model .* has skin but thinks it can render fastpath/,
  /CScaleformComponent_ImageCache evicting/,
  /Missing Vgui material/,
  /Request for .* succeeded/,
  /Bad sequence in GetSequenceName\(\) for model /,
  /Failed, using default cubemap /,
  /Inventory image for item/,
  /CSysSessionClient::Process_ReplyJoinData_Our/,
  /Queued Material System: DISABLED!/,
  /Couldn't get HDR /,
  /Failed to load gamerulescvars.txt, game rules cvars might not be reported to management tools\./,
  /Parent cvar in client.dll not allowed /,
  /Binding uncached material .*, artificially incrementing refcount/,
  /.* : material ".*" not found\./,
  /material ".*" not found\./,
  / used on world geometry without rebuilding map\./,
  /.*::Initialize: .* failed for entity/,
  /.*:  Reinitialized .* predictable entities/,
  /can't be found on disk/,
  /CMaterial::PrecacheVars: error loading vmt file for/,
  /-------------------------/,
  /Bad sequence (.*) in .* for model .*!/
]

const regex = [
  /====csgo_gc_show_matchmaking_stats====/,
  /======================================/,
  /\[.*\] -> \[.* damaged .* for [0-9]+ damage with .*]/, // TTT Damage
]

const elems = ['damage', 'deaths', 'button', 'logs']

let matchmaking_section = false
let ttt_logs = false
let ttt_added = false
let settings = false
let damage_given = false
let damage_taken = false

let matchmaking_section_object = {}
let settings_bracket_count = 0
let ttt_logs_object = [[]]
let settings_object = [[]]
let damage_given_object = [[]]
let damage_taken_object = [[]]

let count = {}

function LogPage () {}

LogPage.load = async function () {
  if (!testLoaded('log')) return

  logger.debug(`We're loading up the log page now.`)
  StateManager.page('log', ['basic', 'log'])

  let tail = Tail.startTailing(StateManager.state.files[0])

  tail.on('line', LogPage.handleLine)

  tail.on('error', (error) => {
    console.log(error)
  })

  setTimeout(() => {
    let props = Object.keys(count).map(function(key) {
      return { key: key, value: this[key] };
    }, count);
    props.sort(function(p1, p2) { return p2.value - p1.value; });
    let top = props.slice(0, 100)
    for (let item of top) {
      console.log(item.value + ": " + item.key)
    }
  }, 5000)
}

LogPage.add = function (item, data) {
  let elem = document.getElementById(item)
  let atBottom = elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()
}

LogPage.handleLine = function (data) {
  data = data.replace(/(\r\n|\n|\r)/gm,"")
  if (!LogPage.itemIgnore(data)) return false
  let type = LogPage.detectType(data)

  if (matchmaking_section) {
    let line = data.split(':')
    if (line.length > 1) {
      matchmaking_section_object[line[0].replace(/\s+/g, '-')] = line[1].replace(/\s+/g, '')
    }
    return false
  }

  if (ttt_logs) {
    ttt_added = true
    ttt_logs_object[ttt_logs_object.length - 1].push(data)
  }

  if (settings) {
    if (type != 'start_settings') {
      settings_object[settings_object.length - 1].push(data)
      if (~data.indexOf('{')) settings_bracket_count++
      if (~data.indexOf('}')) settings_bracket_count--
      if (settings_bracket_count == 0) {
        settings = false
        settings_object.push([])
        // console.log(settings_object)
      }
    }
    return false
  }

  if (damage_given && type != 'damage_given') {
    if (~data.indexOf('Damage Given')) {
      damage_given_object[damage_given_object.length - 1].push(data)
      $('#damage').append(data + '<br />')
    } else {
      damage_given = false
      damage_given_object.push([])
      console.log(damage_given_object)
    }
    return false
  }

  if (damage_taken && type != 'damage_taken') {
    if (~data.indexOf('Damage Taken')) {
      damage_taken_object[damage_taken_object.length - 1].push(data)
      $('#damage').append(data + '<br />')
    } else {
      damage_taken = false
      damage_taken_object.push([])
      $('#damage').append('<hr>')
      console.log(damage_taken_object)
    }
    return false
  }

  if (~['world_kill', 'red_kill', 'pink_kill', 'normal_kill'].indexOf(type)) {
    $('#deaths').append(data + '<br />')
    return false
  }

  if (~['button'].indexOf(type)) {
    $('#button').append(data + '<br />')
    return false
  }

  if (LogPage.filter(data)) {
    if (typeof count[data] == "undefined") {
      count[data] = 1
    } else {
      count[data]++
    }
    $('#logs').append(data + '<br />')
  }
}

LogPage.filter = function (line) {
  for (let item of regex) {
    if (item.test(line)) return false
  }
  if (!showconvar && ~line.indexOf('SetConVar: ')) return false
  if (!showlobbydata && ~line.indexOf('LobbySetData: ')) return false
  return true
}

LogPage.itemIgnore = function (line) {
  for (let item of ignore) {
    if (item.test(line)) {
      return false
    }
  }
  return true
}

LogPage.detectType = function (line) {
  if (line == '====csgo_gc_show_matchmaking_stats====') {
    matchmaking_section = true
    return 'matchmaking_section'
  }
  if (line == '======================================') {
    matchmaking_section = false
    // console.log(matchmaking_section_object)
    return 'end_matchmaking_section'
  }
  if (line == '---------------TTT LOGS---------------') {
    ttt_logs = true
    return 'ttt_logs'
  }
  if (line == '--------------------------------------') {
    ttt_logs = false
    if (ttt_added) {
      // console.log(ttt_logs_object)
      ttt_logs = false
    }
    return 'end_ttt_logs'
  }
  if (/Player: .* - Damage Given/.test(line)) {
    damage_given = true
    return 'damage_given'
  }
  if (/Player: .* - Damage Taken/.test(line)) {
    damage_taken = true
    return 'damage_taken'
  }
  if (/\[[0-9]+:[0-9]+:[0-9]+\].*\[.*\] @tx[0-9]+ @px[0-9]+ died from '.*'/.test(line)) {
    return 'world_kill'
  }
  if (/\[[0-9]+:[0-9]+:[0-9]+\] .*Red kill by .*\[(.*)\] on \[(.*)\] stck\[[-0-9]+\] fz\[[-0-9]+\] ljmp\[[-0-9]+\] lcrh\[[-0-9]+\] lpckup\[[-0-9]+\] dir\[.*\] reason\[(.*)\]/.test(line)) {
    return 'red_kill'
  }
  if (/\[[0-9]+:[0-9]+:[0-9]+\] .*Pink kill by .*\[(.*)\] on \[(.*)\] @tx-[-0-9]+ @px-[-0-9]+ fd\[[-0-9]+\] stck\[[-0-9]+\] fz\[[-0-9]+\] ljmp\[[-0-9]+\] lcrh\[[-0-9]+\] lpckup\[[-0-9]+\] dir\[(.*)\]/.test(line)) {
    return 'pink_kill'
  }
  if (/\[[0-9]+:[0-9]+:[0-9]+\] .*Non red kill by .*\[(.*)\] on \[(.*)\] @tx[-0-9]+ @px[-0-9]+ fd\[[-0-9]+\] stck\[[-0-9]+\] fz\[[-0-9]+\] ljmp\[[-0-9]+\] lcrh\[[-0-9]+\] lpckup\[[-0-9]+\] dir\[(.*)\]/.test(line)) {
    return 'normal_kill'
  }
  if (/\[[0-9]+:[0-9]+:[0-9]+\]- \[.*\] activated \[.*\]\[[0-9]+\]\[[0-9]+\] button/.test(line)) {
    return 'button'
  }
  
  if (~line.indexOf('settings {') || ~line.indexOf('    ExtendedServerInfo {') || ~line.indexOf('Settings {')) {
    settings = true
    settings_bracket_count++
    return 'start_settings'
  }

  return false
}

module.exports = LogPage