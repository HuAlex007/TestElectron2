const { app, BrowserWindow, dialog } = require('electron')
function createWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // 并且为你的应用加载index.html
  win.loadFile('index.html')
  // 打开开发者工具
  //win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。

//alex hu================================================
const electron = require('electron')
//自动更新
const autoUpdater = electron.autoUpdater
function startupEventHandle(){
  //if(require('electron-squirrel-startup')) return;
  var handleStartupEvent = function () {
    if (process.platform !== 'win32') {
      return false;
    }
    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
      case '--squirrel-install':
      case '--squirrel-updated':
        install();
        return true;
      case '--squirrel-uninstall':
        uninstall();
        app.quit();
        return true;
      case '--squirrel-obsolete':
        app.quit();
        return true;
    }
      // 安装
    function install() {
      var cp = require('child_process');    
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--createShortcut", target], { detached: true });
      child.on('close', function(code) {
          app.quit();
      });
    }
    // 卸载
    function uninstall() {
      var cp = require('child_process');    
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--removeShortcut", target], { detached: true });
      child.on('close', function(code) {
          app.quit();
      });
    }
  };
  if (handleStartupEvent()) {
    return ;
  }
}
function updateHandle(){
  ipc.on('check-for-update', function(event, arg) {
    let appName='400电话系统';
    let appIcon=__dirname + '/assets/app/1.ico';
    let message={
      error:'检查更新出错',
      checking:'正在检查更新……',
      updateAva:'下载更新成功',
      updateNotAva:'现在使用的就是最新版本，不用更新',
      downloaded:'最新版本已下载，将在重启程序后更新'
    };
    const os = require('os');
    const {dialog} = require('electron');
    autoUpdater.setFeedURL('放最新版本文件的文件夹的服务器地址');
    
	autoUpdater.on('error', function(error){
      return dialog.showMessageBox(mainWindow, {
          type: 'info',
          icon: appIcon,
          buttons: ['OK'],
          title: appName,
          message: message.error,
          detail: '\r'+error
      });
    })
    .on('checking-for-update', function(e) {
        return dialog.showMessageBox(mainWindow, {
          type: 'info',
          icon: appIcon,
          buttons: ['OK'],
          title: appName,
          message: message.checking
      });
    })
    .on('update-available', function(e) {
        var downloadConfirmation = dialog.showMessageBox(mainWindow, {
            type: 'info',
            icon: appIcon,
            buttons: ['OK'],
            title: appName,
            message: message.updateAva
        });
        if (downloadConfirmation === 0) {
            return;
        }
    })
    .on('update-not-available', function(e) {
        return dialog.showMessageBox(mainWindow, {
            type: 'info',
            icon: appIcon,
            buttons: ['OK'],
            title: appName,
            message: message.updateNotAva
        });
    })
    .on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        var index = dialog.showMessageBox(mainWindow, {
            type: 'info',
            icon: appIcon,
            buttons: ['现在重启','稍后重启'],
            title: appName,
            message: message.downloaded,
            detail: releaseName + "\n\n" + releaseNotes
        });
        if (index === 1) return;
        autoUpdater.quitAndInstall();
    });
    autoUpdater.checkForUpdates();
 });
}
//调用函数
startupEventHandle()

