import { app, ipcMain } from 'electron';

import { di } from './app/di/container.di';
import { WindowService } from './app/window/interfaces/window.service';
import { CONFIG_DI } from './app/di/config.di';
import { TrayService } from './app/window/interfaces/tray.service';
import { FsService } from './app/common/fs.service';

try {

  const windowService = di.get<WindowService>(CONFIG_DI.WindowService);
  const trayService = di.get<TrayService>(CONFIG_DI.TrayService);
  const fsService = di.get<FsService>(CONFIG_DI.FsService);
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {

    windowService.createWindow();
    trayService.createTray();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  ipcMain.on('saveSudoFile', (event, arg) => {
    console.log('saveSudoFile');

    fsService.moveFileSudo(arg);
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    windowService.openWindow();

    // trayService.createTray();
  });
} catch (e) {
  // Catch Error
  throw e;
}
