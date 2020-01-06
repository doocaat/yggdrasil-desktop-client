import { inject } from 'inversify';
import * as url from 'url';
import * as path from 'path';
import { BrowserWindow, screen } from 'electron';
import { provide } from 'inversify-binding-decorators';
import { SettingService } from './setting.service';

@provide(WindowService)
export class WindowService {
  private serve;

  window: BrowserWindow = null;

  constructor(@inject(SettingService) private readonly settingService: SettingService) {
    const args = process.argv.slice(1);
    this.serve = args.some(val => val === '--serve');
  }

  openWindow(windowUrl: string = '', isShow = true): void {
    if (!this.window || this.window.isDestroyed) {
      this.createWindow(isShow);
    }
    this.window.loadURL(this.getWindowUrl() + windowUrl);
  }

  openBrowserWindow(windowUrl: string = '', isShow = true): void {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    const window = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      frame: true,
      backgroundColor: '#E6E6E6',
      webPreferences: {
        nodeIntegration: true,
        sandbox: false,
        webSecurity: false,
        webviewTag: true,
      },
      show: isShow,
    });

    const proxyConf = {
      proxyRules: `${this.settingService.getProxyHost()}:${this.settingService.getProxyPort()}`
    };

    window.webContents.session.setProxy(proxyConf as any).then( () => {
      window.loadURL(this.getWindowUrl() + windowUrl);
    });
  }

  sendAllWindow(channel: string, data?: any) {
    BrowserWindow.getAllWindows()
    .forEach(window => {
      window.webContents.send(channel, data);
    });
  }

  getWindowUrl(): string {
    if (this.serve) {
      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/../../../node_modules/electron`)
      });
      return 'http://localhost:4200';
    } else {
      return url.format({
        pathname: path.join(__dirname, '/../../dist/ui/index.html'),
        protocol: 'file:',
        slashes: true
      });
    }
  }

  closeWindow(destroy = false) {
    if (!this.window || this.window.isDestroyed) {
      return;
    }

    this.window.hide();

    if (destroy) {
      this.window.destroy();
      this.window = null;
    }
  }

  createWindow(show = false) {
    if (this.window && !this.window.isDestroyed) {
      this.closeWindow(true);
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
      show: show
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
