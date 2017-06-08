const fs = require('fs')
const $  = require('jquery')

function WelcomePage () {}

WelcomePage.load = function () {
	if (!testLoaded('welcome')) return

	logger.log('Loading up the welcome page...')
	StateManager.page('welcome', ['basic', 'welcome'])

	if (process.env.NODE_ENV !== 'production') fillFields()

  $('#open').on('submit', async function onLogin (e) {
    e.preventDefault()
    let details = Utils.getItemsFromForm('open')
    if (fs.existsSync(details.log)) {
      StateManager.change('state', 'log')
      StateManager.change('files', [details.log])
      StateManager.update()
    } else {
      logger.error('File does not exis or we do not have access to it.')
      Materialize.toast('That file doesn\'t exist.', 5000)
    }
  })
}

/**
 * When we're not in production, we can keep user information in a
 * .env file so that we don't have to enter it every time.
 * @return {undefined}
 */
function fillFields () {
  $('#log').val('C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\csgo\\console.log')
  $('#quick').prop('checked', true)
}

module.exports = WelcomePage