const ipc = require('electron').ipcRenderer
const remote = require('electron').remote
const targetForm = document.getElementById('attackForm')

targetForm.addEventListener('submit', function () {
  ipc.send('attack-network', document.getElementById('networks').value)
  var window = remote.getCurrentWindow();
  var targetNetwork = document.getElementById('networks').value;
  const ProgressBar = remote.getGlobal('ProgressBar');
  var progressBar = new ProgressBar({
    abortOnError: false,
    indeterminate: true,
    closeOnComplete: true,
    title: 'Attacking...',
    text: 'Attacking network '+targetNetwork+'...',
    style: {
      text: {},
      detail: {},
      bar: { 'width': '100%', 'background-color': '#BBE0F1' },
      value: {}
    },
    browserWindow: {
      parent: window,
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
    progressBar.detail = 'Attacking complete. Exiting...';
  });

  const exec = require('child_process').exec;
  exec('ssh kali@172.20.10.6 "cd /home/kali/scripts && ./launchAttack.sh '+targetNetwork+' &> /dev/null"', (output) => {
    console.log(output);
    console.log("Attacking Complete");
    progressBar.setCompleted();
    window.close();
  });
})
