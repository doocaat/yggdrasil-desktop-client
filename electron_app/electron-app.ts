import {
  app,
  BrowserWindow,
  screen,
  Tray,
  Menu,
  nativeImage,
  ipcMain
} from 'electron';
import * as url from 'url';
import * as path from 'path';

export default class ElectronApp {
  private _configWindow;
  private serve;
  private _tray;

  constructor() {
    const args = process.argv.slice(1);
    this.serve = args.some(val => val === '--serve');
  }

  get winUrl(): string {
    if (this.serve) {
      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/../node_modules/electron`)
      });
      return 'http://localhost:4200';
    } else {
      return url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      });
    }
  }

  createTray() {
    const trayIconPath = path.join(__dirname, `../src/assets/tray/disconnect.png`);

    let trayIconImage = nativeImage.createFromPath(trayIconPath);
    trayIconImage = trayIconImage.resize({ width: 16, height: 16 });

    const trayMenuTemplate = [
      {
        label: 'Config',
        click: () => {
          if (this._configWindow === null) {
            this.createConfigWindow();
          }
          this._configWindow.loadURL(this.winUrl + '#/config/info');
          this._configWindow.show();
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

    this._tray = new Tray(trayIconImage);
    this._tray.setContextMenu(trayMenu);

    this._tray.setToolTip('Right Click Icon for Options.');
    this._tray.setTitle('Title');

    this._tray.on('click', (ev, bounds) => {
      // Click event bounds
      const { x, y } = bounds;
      // Window height & width
      const { height, width } = this._configWindow.getBounds();

      if (this._configWindow.isVisible()) {
        this._configWindow.hide();
      } else {
        /////////////////////////////////////////////////////////////////////////////////////////////
        // On Windows I had to parseInt the corrdinates
        /////////////////////////////////////////////////////////////////////////////////////////////
        const yPosition = process.platform === 'darwin' ? y : y - height;
        const xPosition =
          process.platform === 'darwin' ? x - width / 2 : x - width / 2;

          this._configWindow.setBounds({
          x: Math.floor(xPosition),
          y: Math.floor(yPosition),
          height,
          width
        });

        this._configWindow.show();
      }
    });
  }

  createConfigWindow() {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;
    this._configWindow = new BrowserWindow({
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

    this._configWindow.loadURL(this.winUrl);
    if (this.serve) {
      this._configWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    this._configWindow.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this._configWindow = null;
    });
  }

  get configWindow() {
    return  this._configWindow;
  }

  get tray() {
      return this._tray;
  }
}
