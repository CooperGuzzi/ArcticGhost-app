// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
//const scanButton = document.getElementById('scanBtn');
//scanButton.addEventListener('click', () => {
  //createBrowserWindow();
//});
const electron = require('electron')
const path = require('path')
const { getGlobal, app, BrowserWindow } = electron.remote;
const ipc = electron.ipcRenderer
var target = document.querySelector('h1')
var targetNetworkVal;
var targetNetwork = document.getElementById('targetNetwork')

function launchScanWindow() {
  const ProgressBar = getGlobal('ProgressBar');
  //const ProgressBar = require('electron-progressbar');
  var progressBar = new ProgressBar({
    abortOnError: false,
    indeterminate: true,
    closeOnComplete: true,
    title: 'Scanning...',
    text: 'Scanning for networks...',
    style: {
      text: {},
      detail: {},
      bar: { 'width': '100%', 'background-color': '#BBE0F1' },
      value: {}
    },
    browserWindow: {
      parent: null,
      modal: true,
      resizable: false,
      closable: false,
      minimizable: false,
      maximizable: false,
      width: 500,
      height: 170,
      webPreferences: {
        nodeIntegration: true
      }
    }
  });

  progressBar.on('completed', (value) => {
      console.log(progressBar.isCompleted());
      console.log('Progress Bar Completed');
      progressBar.detail = 'Scan completed. Exiting...';
  });
  //console.log("clicked scan");
  //var command = 0;
  const exec = require('child_process').exec;
  //'echo "kali" | sudo -S ./scripts/scan.sh' {on below add &> /dev/null
  exec('ssh kali@172.20.10.6 "cd /home/kali/scripts && ./launchScan.sh &> /dev/null"', (output) => {
    console.log(output);
    console.log("ssh'ed into payload, scan complete.");
    //progressBar.setCompleted();
    exec('scp kali@172.20.10.6:/home/kali/scripts/bigData-01.csv bigData-01.csv', (output) => {
        console.log(output);
        console.log("scan data copied to desktop");
        //progressBar.setCompleted();
        exec('cp bigData-01.csv "./logs/scan-$(date +"%m-%d-%r")"', (output) => {
          console.log(output);
          console.log("scan data copied to /logs directory");
          progressBar.setCompleted();
        });
    });
  });
  
}

function launchAttackWindow() {
  //document.getElementById('attackBtn').disabled = true;
  //document.getElementById('scanBtn').disabled = true;
  const exec = require('child_process').exec;
  var filepath = __dirname;
  exec('bash '+filepath+'/displayData.sh', (output) => {
    console.log(output);
    const modalPath = path.join('file://', __dirname, 'attack.html')
    let win = new BrowserWindow({width: 600, height: 400, webPreferences:
      {nodeIntegration: true, devTools: true, enableRemoteModule: true}})
    win.on('close', function () { win = null})
    win.loadURL(modalPath)
    win.webContents.openDevTools()
    win.show()
  });
}

function launchLogsWindow() {
  //console.log("clicked logs");
  const shell = require('electron').shell
  var filepath = __dirname;
  shell.showItemInFolder(filepath+'/logs/*');
  //shell.openItem(filepath+'/logs');
}

ipc.on('targetNetworkVal', function (event, arg) {
  console.log('here');
  targetNetworkVal = String(arg);
  console.log(targetNetworkVal);
});
