const { ipcRenderer, remote }   = require('electron')
const $                         = require('jquery')
const Tail                      = require('tail').Tail

const regex = [
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
  /^[ ]*}\n/,
  /Inventory image for item/,
  /CSysSessionClient::Process_ReplyJoinData_Our/,
  /Queued Material System: DISABLED!/,
  /Couldn't get HDR /
]

function LogPage () {}

LogPage.load = async function () {
  if (!testLoaded('mail')) return

  let count = {}

  logger.debug(`We're loading up the mail page now.`)
  StateManager.page('log', ['basic', 'log'])

  let tail = new Tail(StateManager.state.files[0], { fromBeginning: true })

  tail.on('line', (data) => {
    if (LogPage.filter(data)) {
      if (typeof count[data] == "undefined") {
        count[data] = 1
      } else {
        count[data]++
      }
      $('#logs').append(data + '<br />')
    }
  })

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

LogPage.filter = function (line) {
  for (let item of regex) {
    if (item.test(line)) {
      return false
    }
  }
  return true
}

module.exports = LogPage