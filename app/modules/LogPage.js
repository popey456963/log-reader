const { ipcRenderer, remote }   = require('electron')
const $                         = require('jquery')

function MailPage () {}

MailPage.load = async function () {
  if (!testLoaded('mail')) return

  logger.debug(`We're loading up the mail page now.`)
  StateManager.page('mail', ['basic', 'mail'])
}

module.exports = MailPage