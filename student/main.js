const electron = require('electron');
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


const axios = require('axios');
const moment = require('moment');

// require('./test_file.js')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var ip = require('ip');

let address = ip.address() 
//导入配置
const {server_host,server_port} = require('../config');

function recodeStuComment(status){
  let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  let commentStatus = status? '1':'0';
  let postData = {
    comment:{
       time:date,
       info:commentStatus,
    },
    stuAddr:address
  };
  axios.post(`${server_host}:${server_port}/infos`,postData)
  .then(res=>{
    let contents = mainWindow.webContents;
    contents.send('showLogs',date + '记录一次'+ (status?'清楚':'不懂'));
  })
  .catch(err => console.log(err) );
}

function createWindow () {
  let ret = globalShortcut.register('CommandOrControl+Down',()=>{
      recodeStuComment(false);
  });
  if (!ret) {
    console.log('registration failed')
  }
  ret = globalShortcut.register('CommandOrControl+Up',()=>{
      recodeStuComment(true);
  });
  
  if (!ret) {
    console.log('registration failed')
  }


  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))



  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
