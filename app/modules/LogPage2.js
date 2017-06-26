const { ipcRenderer, remote }   = require('electron')
const byline = require('byline')
const Regex = require('./Regex.js')
const Tail = require('file-tail')
const fs = require('fs')
const $ = require('jquery')

function o(a) { return a || '' }
function p(p) {}

let display_default = {
  'top-left': {
    'damage_taken': true,
    'damage_given': true,
    'round_start': false
  },
  'middle-left': {
    'ttt_role': true,
    'ttt_damage': true,
    'ttt_kill': true,
    'ttt_tase': true,
    'ttt': true,
    'round_start': false
  },
  'bottom-left': {
    'button': true,
    'cell_button': true, 
    'warden': true,
    'round_start': false,
    'respawn_location': true,
    'rename': true,
    'unknown': false
  },
  'top-right': {
    'msg': true,
    'pm_msg': true,
    'balancer': true,
    'weapon_boost': true,
    'upgrades': true,
    'spray': true,
    'tasers': true,
    'warden_debug': true,
    'drops': true,
    'zones': true,
    'convar': false,
    'connected': true,
    'unknown_command': false,
    'failed_send': true,
    'round_start': false
  },
  'bottom-right': {
    'world_kill': true,
    'red_kill': true,
    'pink_kill': true,
    'normal_kill': true,
    'round_start': true
  }
}

let display = JSON.parse((localStorage.getItem('display') || JSON.stringify(display_default)))
let displayShallow = {}

for (let item in Regex.type) {
  displayShallow[item] = []
  for (let div in display) {
    if (display[div][item]) {
      displayShallow[item].push(div)
    }
  }
}

const count = {}
let counter = 0
let total = 0
let tidy = false
let lines = []

let inSettingObject = false
let settingDepth = 0

const toastr_time = 4000

function LogPage () {}

LogPage.load = async function (shouldTidy) {
  if (!testLoaded('log')) return

  logger.debug(`We're loading up the log page now.`)
  StateManager.page('log', ['basic', 'log'])

  tidy = shouldTidy

  if (tidy) {
    $('#progress').css('display', 'auto')
    await new Promise((a) => { fs.unlink(StateManager.state.files[0] + '.clean', a) })
  } else {
    $('#progress').css('display', 'none')
  }

  let stream = byline(fs.createReadStream(StateManager.state.files[0], { encoding: 'utf8' }))

  // fs.readFile(StateManager.state.files[0], 'utf8', async (err, data) => {
  //   if (err) logger.error(err)
  //   let array = data.split('\n')
  //   let full_count = array.length
  //   if (!tidy) array = array.slice(1).slice(-10000)
  //   for (let item of array) {
  //     counter++
  //     if (counter % 100 == 0) {
  //       counter = 0
  //       total += 100
  //       if (tidy) {
  //         $('#progress-bar').css('width', (total / full_count) + '%')
  //       }
  //       // if (total % 5000 == 0) { break }
  //       if (!tidy) { await (new Promise((a) => { setTimeout(a, 50) })) }
  //     }
  //     item = LogPage.sortLine(item)
  //     if (item) LogPage.displayItem(item, true)
  //   }
  //   if (tidy) {
  //     await new Promise((a) => { fs.appendFile(StateManager.state.files[0] + '.clean', lines.join('\n'), a) })
  //     await new Promise((a) => { fs.unlink(StateManager.state.files[0], a) })
  //     await new Promise((a) => { fs.rename(StateManager.state.files[0] + '.clean', StateManager.state.files[0], a) })
  //   }
  // })

  stream.on('data', async (line) => {
    line = LogPage.sortLine(line)
    if (line) LogPage.displayItem(line)

    if (counter == 10) {
      stream.pause()
      await (new Promise((a) => { counter = 0; setTimeout(a, 10) }))
      stream.resume()
    }
    counter ++
  })

  let tail = Tail.startTailing(StateManager.state.files[0])

  tail.on('line', (line) => {
    line = LogPage.sortLine(line)
    if (line) LogPage.displayItem(line)
  })

  tail.on('error', (error) => {
    console.log(error)
  })

  $(() => {
    $('.modal').modal()
    $('#log').val(StateManager.state.files[0])
    Materialize.updateTextFields()
    for (let div in display) {
      for (let group of Object.values(Regex.list)) {
        $(`#input-${div}`).append($(`<optgroup label="${group[0]}">`))
        for (let [index, item] of Object.entries(group[1])) {
          $(`#input-${div}`).append($(`<option value="${index}" ${ displayShallow[index].indexOf(div) > -1 ? /*'selected'*/ '' : ''}>${item}</option>`))
        }
        $(`#input-${div}`).append($(`</optgroup>`))
      }
    }
    $('select').material_select()
    for (let div in display) {
      for (let group of Object.values(Regex.list)) {
        for (let [index, item] of Object.entries(group[1])) {
          if (displayShallow[index].indexOf(div) > -1) {
            $($(`#input-${div}`)[0].previousSibling).find(`li span:contains("${item}")`).click()
          }
        }
      }
    }
  })

  $('#save').click(() => {
    StateManager.change('files', [$('#log').val()])
    for (let div in display) {
      let values = $(`#input-${div}`).val()
      display[div] = {}
      for (let item of values) {
        display[div][item] = true
      }
    }
    localStorage.setItem('display', JSON.stringify(display))
  })

  $('#default').click(() => {
    localStorage.setItem('display', '')
    display = JSON.parse((localStorage.getItem('display') || JSON.stringify(display_default)))
  })

  $('#clean').click(() => {
    Materialize.toast('This has been disabled due to a known bug :(', toastr_time)
    // $('#modal1').modal('close')
    // LogPage.load(true)
    
  })
}

LogPage.displayItem = (item, zoom) => {
  // if (hidden[item.type]) return false

  switch(item.type) {
    case 'convar':
      LogPage.addItem(item.type, `Set Convar "${item.data.convar}" to "${item.data.value}"`)
      break
    case 'msg':
      let tags = `${o(item.data.dead)}${o(item.data.team)}${o(item.data.rank)}${o(item.data.donator)}`
      if (tags != '') tags = ' ' + tags
      LogPage.addItem(item.type, `>${tags}${item.data.user}: ${item.data.message.trim()}`)
      break
    case 'damage_taken':
      LogPage.addItem(item.type, `<-- ${item.data.player} | ${item.data.damage} in ${item.data.hits} ${ item.data.hits > 1 ? 'hits' : 'hit' }`)
      break
    case 'damage_given':
      LogPage.addItem(item.type, `--> ${item.data.player} | ${item.data.damage} in ${item.data.hits} ${ item.data.hits > 1 ? 'hits' : 'hit' }`)
      break
    case 'world_kill':
      LogPage.addItem(item.type, `[${item.data.time}] [${item.data.player}] @tx${item.data.time_slot} @px${item.data.position_slot} killed by '${item.data.killer}'`)
      break
    case 'red_kill':
      LogPage.addItem(item.type, `[${item.data.time}] [${item.data.killer}] killed red [${item.data.player}]`)
      break
    case 'pink_kill':
      LogPage.addItem(item.type, `[${item.data.time}] [${item.data.killer}] killed pink [${item.data.player}]`)
      break
    case 'normal_kill':
      LogPage.addItem(item.type, `[${item.data.time}] [${item.data.killer}] killed non-red [${item.data.player}]`)
      break
    case 'cell_button':
      LogPage.addItem(item.type, `${item.data.player} pressed cell button.`)
      break
    case 'ttt_role':
      LogPage.addItem(item.type, `You are a ${item.data.role}!`)
      if (!zoom) {
        switch (item.data.role) {
          case 'TRAITOR':
            Materialize.toast('You are a traitor!', toastr_time)
            break
          case 'DETECTIVE':
            Materialize.toast('You are a detective!', toastr_time)
            break
          case 'INNOCENT':
            Materialize.toast('You are an innocent!', toastr_time)
            break
          default:
            Materialize.toast(`You are a ${item.data.role}`, toastr_time)
        }
      }
      break
    case 'ttt':
      LogPage.addItem(item.type, `${item.data.msg}`)
      break
    case 'round_start':
      LogPage.addItem(item.type, `<hr>`)
      break
    case 'rename':
      LogPage.addItem(item.type, `Renamed '${item.data.from}'' to '${item.data.to}'`)
    case 'respawn_location':
      Materialize.toast(`You were respawned at ${item.data.x} ${item.data.y} ${item.data.z}`, toastr_time)
    default:
      if (typeof item.data == 'string') {
        LogPage.addItem(item.type, item.data)
      }
  }
}

LogPage.addItem = (name, item) => {
  for (let div of (displayShallow[name] || [])) {
    let divObj = document.getElementById('outside_' + div)
    let atBottom = divObj.scrollHeight - divObj.scrollTop === divObj.clientHeight
    $('#' + div).append(item + '<br />')
    if (atBottom) {
      $('#' + 'outside_' + div).stop().animate({
        scrollTop: $('#' + 'outside_' + div)[0].scrollHeight
      }, 0)
    }
  }

}

LogPage.sortLine = (line) => {
  line = line.replace(/(\r\n|\n|\r)/gm,"")
  if (LogPage.ignore(line)) return false
  if (tidy) { 
    lines.push(line)
    return false
  }
  let type = LogPage.typeOf(line)
  let data

  let regex = Regex.type[type]
  if (typeof regex != 'undefined') {
    if      (regex[1] === '') data = ''
    else if (regex[1] === undefined) data = line
    else if (typeof regex[1] === 'object' && regex[1].length === 0) data = line
    else    data = LogPage.destructure(line, ...Regex.type[type])
  } else {
    data = line
  }

  return {
    type: type,
    data: data
  }
}

LogPage.destructure = (line, regex, items) => {
  let match = line.match(regex)
  let data = {}
  for (let i = 1; i <= items.length; i++) {
    data[items[i - 1]] = match[i]
  }
  return data
}

LogPage.ignore = (line) => {
  for (let item of Regex.error) {
    if (item.test(line)) {
      count[String(item)] = (count[String(item)] || 0) + 1
      return true
    }
  }
}

LogPage.typeOf = (line) => {
  for (let name in Regex.type) {
    if (Regex.type[name][0].test(line)) {
      return name
    }
  }
  return 'unknown'
}

module.exports = LogPage