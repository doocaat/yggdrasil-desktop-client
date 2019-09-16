import { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as sudo from 'sudo-prompt';
import * as fs from 'fs';

let win, serve, tray, winUrl;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  // Create the browser window.

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false,
      webSecurity: false
    },
    show: false
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    winUrl = 'http://localhost:4200';
  } else {
    winUrl =  url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    });
  }
  win.loadURL(winUrl);
  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

function createTray() {
  const trayIconPath = path.join(__dirname, `src/assets/tray/disconnect.png`);

  let trayIconImage = nativeImage.createFromPath(trayIconPath);
  trayIconImage = trayIconImage.resize({ width: 16, height: 16 });

  const trayMenuTemplate = [
    {
      label: 'Config',
      click: () => {
        if (win === null) {
          createWindow();
        }
        win.loadURL(winUrl + '#/config/info');
        win.show();
      }
    },
    {
      label: 'Exit',
      click: () => {
        app.quit();
      }
    }
  ];

  const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);

  tray = new Tray(trayIconImage);
  tray.setContextMenu(trayMenu);

  tray.setToolTip('Right Click Icon for Options.');
  tray.setTitle('Title');

  tray.on('click', (ev, bounds) => {
    // Click event bounds
    const { x, y } = bounds;
    // Window height & width
    const { height, width } = win.getBounds();

    if (win.isVisible()) {
      win.hide();
    } else {
      /////////////////////////////////////////////////////////////////////////////////////////////
      // On Windows I had to parseInt the corrdinates
      /////////////////////////////////////////////////////////////////////////////////////////////
      const yPosition = process.platform === 'darwin' ? y : y - height;
      const xPosition =
        process.platform === 'darwin' ? x - width / 2 : x - width / 2;

      win.setBounds({
        x: Math.floor(xPosition),
        y: Math.floor(yPosition),
        height,
        width
      });

      win.show();
    }
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow();
    createTray();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      // app.quit();
    }
  });

  ipcMain.on('saveSudoFile', (event, arg) => {
    console.log('saveSudoFile ' + arg);
    const options = {
      name: arg.actionTitle,
      icns: `${__dirname}/src/assets/tray/disconnect.png`, // (optional)
    };

    fs.writeFile(arg.tmpFilePath, arg.data, (error) => {
      if (error) { throw error; }
      sudo.exec(`mv ${arg.tmpFilePath} ${arg.filePath}`, options, (errors, stdout, stderr) => {
        if (errors) { throw errors; }
        console.log('Send ' + arg.responseEventName);
        win.webContents.send(arg.responseEventName, arg.data);
      });
    });
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }

    if (tray === null) {
      createTray();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
