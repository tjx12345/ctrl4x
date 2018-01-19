// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer,globalShortcut} = require('electron')

ipcRenderer.on('showLogs',(event, args)=>{
  let ul = document.getElementById('txt');
  ul.innerHTML += '<li>' + args + '</li>';
})