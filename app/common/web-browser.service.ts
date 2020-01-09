import { provide } from 'inversify-binding-decorators';
import { BrowserWindow, screen } from 'electron';
import { inject } from 'inversify';
import { SettingService } from './setting.service';
import { WindowTools } from './tools/window.tools';
import { app, ipcMain } from 'electron';

@provide(WebBrowserService)
export class WebBrowserService {

    constructor(@inject(SettingService) private readonly settingService: SettingService) {
        this.initIpcHandler();
    }

    private initIpcHandler() {
        ipcMain.on('webbrowser:create', (event, arg) => {
            this.openBrowserWindow();
          });
    }

    openBrowserWindow(isShow = true): void {
        const electronScreen = screen;
        const size = electronScreen.getPrimaryDisplay().workAreaSize;

        const window = new BrowserWindow({
          x: 0,
          y: 0,
          width: size.width,
          height: size.height,
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
          window.loadURL(WindowTools.getUrl() + '#/browser/web');
        });
      }
}
