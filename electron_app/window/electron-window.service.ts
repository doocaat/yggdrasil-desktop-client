import { injectable } from 'inversify';
import { WindowService } from './interfaces/window.service';
import * as url from 'url';
import * as path from 'path';
import {
  BrowserWindow,
  screen} from 'electron';

@injectable()
export class ElectronWindowService implements WindowService {
  private serve;

  window: BrowserWindow = null;

  constructor() {
    const args = process.argv.slice(1);
    this.serve = args.some(val => val === '--serve');
  }

  openWindow(windowUrl: string = ''): void {
    if (this.window === null) {
      this.createWindow();
    }
    this.window.loadURL(this.getWindowUrl() + windowUrl);
    this.window.show();
  }

  getWindowUrl(): string {
    if (this.serve) {
      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/../../node_modules/electron`)
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

  closeWindow() {
      this.window.hide();
      this.window.destroy();
      this.window = null;
  }

  createWindow() {

    if (this.window !== null) {
        return;
    }

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    this.window = new BrowserWindow({
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
    if (this.serve) {
      this.window.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    this.window.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.closeWindow();
    });
  }

  getWindow(): BrowserWindow | null {
    return this.window;
  }
}
