import { ipcMain, BrowserWindow } from 'electron';
import { inject } from 'inversify';
import { WindowService } from './window.service';
import { provide } from 'inversify-binding-decorators';

@provide(DAppsService)
export class DAppsService {
  window: BrowserWindow;

  constructor(@inject(WindowService) private windowService: WindowService) {
    ipcMain.on('dapps:account:open', (event, arg) => {
      console.log('dapps:account:open');
      this.createWindow();
    });
  }

  createWindow() {
    if (this.window) {
      // this.window.show();
      return;
    }

    this.window = this.windowService.createWindow(
      '#/dapps/account',
      true,
      545,
      685
    );

    this.window.on('close', () => {
      this.window = null;
    });
  }
}
