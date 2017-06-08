'use strict'
const electron = require('electron')
const { app, shell } = require('electron')
const createWindow = require('./app/helpers/window')

// Allow app to be accessible globally.
global.app = app

// adds global logging
require('./app/helpers/logger')

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({ enabled: true, showDevTools: false })

// prevent window being garbage collected
let windows = []

function onClosed (number) {
  if (process.platform !== 'darwin' && !number) {
    windows.map((val) => { return null })
    app.quit()
  }
  windows[number] = null
  logger.log(`Someone closed window number ${number}`)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!windows[0]) {
    openWindow('main')
  }
})

app.on('ready', () => {
  openWindow('main')
  electron.globalShortcut.register('CmdOrCtrl+Shift+C', () => {
    openWindow('compose')
  })
})

function openWindow (file) {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  let index = file === 'main' ? 0 : windows.length

  windows[index] = createWindow(file, {
    width, height,
    icon: 'build/128x128.png',
    minWidth: 320, 
    minHeight: 480,
    maximized: true,
    frame: false
  })
  windows[index].loadURL(`file://${__dirname}/app/${file}.html`)
  windows[index].on('closed', ((i) => {
    return () => { onClosed(i) }
  })(index))
  windows[index].webContents.openDevTools()
  windows[index].webContents.on('new-window', handleURL)
  windows[index].webContents.on('will-navigate', handleURL)
}

function handleURL (e, url) {
  if (url.indexOf('file://') == '-1') {
    e.preventDefault()
    shell.openExternal(url)
  }
}

electron.ipcMain.on('open', (event, arg) => {
  openWindow(arg.file)
})

electron.ipcMain.on('send', (event, arg) => {
  logger.log(event)
  logger.log(arg)
  windows[0].webContents.send('send', arg)
})
