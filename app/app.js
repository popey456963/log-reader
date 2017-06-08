const { remote, ipcRenderer } = require('electron')
const Navigo = require('navigo')

console.log("%cStop!", "font: 2em sans-serif; color: yellow; background-color: red;");
console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or “hack” someone’s account, it is a scam and will give them access to your account.", "font: 1.5em sans-serif; color: grey;");

global.app = remote.app
global.router = new Navigo(null, true, '#')

require('dotenv').config()
require('./helpers/logger')
// require('./helpers/switch')

global.StateManager = require('./modules/StateManager')
global.Utils = require('./modules/Utils')

// Header creates and updates the top bar.
global.Header = require('./modules/Header')

// WelcomePage, SetupPage and MailPage all handle the rendering of specific pages.
global.WelcomePage = require('./modules/WelcomePage')
global.SetupPage = require('./modules/SetupPage')
global.LogPage = require('./modules/LogPage2')

Header.load()

router.on({
  '/setup': () => { Utils.time(SetupPage.load) },
  '/welcome': () => { Utils.time(WelcomePage.load) },
  '/log': () => { Utils.time(LogPage.load) }
}).resolve()

router.navigate('/setup')
