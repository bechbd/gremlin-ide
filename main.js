'use strict';

// Import parts of electron to use
const { app, BrowserWindow } = require('electron');
const electron = require('electron')
const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const Gremlin = require('gremlin');
const unhandled = require('electron-unhandled');
const settings = require('electron-settings');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let client;

// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

function createWindow() {

  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    title: "Gremlin IDE",
    titleBarStyle: "hidden",
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    width: width,
    height: height
  });
  // mainWindow.maximize();
  // and load the index.html of the app.
  let indexPath;
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  //check for default settings
  if (!settings.has("loginInfo")) {
    console.log("No Settings exists, creating them")
    var setting = {
      serverName: "localhost",
      serverPort: 8182,
      userName: "",
      password: "",
      opProcessor: "",
      useSSL: false
    };
    settings.set("loginInfo", setting);
  } else {
    console.log("Settings Exist");
    console.log(settings.get("loginInfo"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on('query:execute', (e, query) => {
  client = Gremlin.createClient(settings.get("loginInfo.serverPort"), settings.get("loginInfo.serverName"),
    { ssl: settings.get("loginInfo.useSSL"), user: settings.get("loginInfo.userName"), password: settings.get("loginInfo.password"), processor: settings.get("loginInfo.opProcessor") || ""});
  if (client == null) {
    client = connectToDatabase();
  }

  client.execute(query, (err, results) => {
    if (err) {
      const msg = err.message;
      e.returnValue = { isError: true, error: msg };
    } else {
      e.returnValue = { isError: false, results: parseGraphson(results) };
    }
  });
})

ipc.on('connection:newConnection', (e) => {
  client = null;
  e.returnValue = true;
})

function connectToDatabase(loginInfo) {
  console.log("connectToDatabase");
  const db = Gremlin.createClient(loginInfo.serverPort, loginInfo.serverName, { ssl: loginInfo.useSSL, user: loginInfo.userName, password: loginInfo.password, processor: loginInfo.opProcessor || ""});
  return db;
}

//Copied from https://github.com/bricaud/graphexp/blob/master/scripts/graphioGremlin.js
function parseGraphson(data) {
  if (!(Array.isArray(data) || ((typeof data === "object") && (data !== null)))) return data;
  if ('@type' in data) {
    if (data['@type'] == 'g:List') {
      data = data['@value'];
      return parseGraphson(data);
    } else if (data['@type'] == 'g:Set') {
      data = data['@value'];
      return data;
    } else if (data['@type'] == 'g:Map') {
      var data_tmp = {}
      for (var i = 0; i < data['@value'].length; i += 2) {
        var data_key = data['@value'][i];
        if ((typeof data_key === "object") && (data_key !== null)) data_key = parseGraphson(data_key);
        if (Array.isArray(data_key)) data_key = JSON.stringify(data_key).replace(/\"/g, ' ');
        data_tmp[data_key] = parseGraphson(data['@value'][i + 1]);
      }
      data = data_tmp;
      return data;
    } else if (data['@type'] == 'g:Path') {
      data = data['@value'];
      data["isPath"] = true;
    } else {
      data = data['@value'];
      if ((typeof data === "object") && (data !== null)) data = parseGraphson(data);
      return data;
    }
  } else if (Array.isArray(data) || ((typeof data === "object") && (data !== null))) {
    for (var key in data) {
      data[key] = parseGraphson(data[key]);
    }
    return data;
  }
  return data;
}

unhandled();
