const $          = require('jquery')

function WelcomePage () {}

WelcomePage.load = function () {
	if (!testLoaded('welcome')) return

	logger.log('Loading up the welcome page...')
	StateManager.page('welcome', ['basic', 'welcome'])

	if (process.env.NODE_ENV !== 'production') fillFields()

  $('#open').on('submit', async function onLogin (e) {
    e.preventDefault()
    let details = Utils.getItemsFromForm('open')
  	console.log(details)
  })
}

/**
 * When we're not in production, we can keep user information in a
 * .env file so that we don't have to enter it every time.
 * @return {undefined}
 */
function fillFields () {
  $('#host_outgoing').val(process.env.HOST_OUTGOING)
  $('#secure').prop('checked', process.env.SECURE === 'true')
}

module.exports = WelcomePage