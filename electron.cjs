const { app, BrowserWindow } = require('electron')
const path = require('path')

app.setLoginItemSettings({
  openAtLogin: true,
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#080810',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  })

  win.loadFile(path.join(__dirname, 'dist/index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})