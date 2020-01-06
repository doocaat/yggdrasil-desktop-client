import { app, ipcMain } from 'electron';
import { di } from './app/di/container.di';
import { FsService } from './app/common/fs.service';
import {WindowService} from './app/common/window.service';
import {TrayService} from './app/common/tray.service';
import './app/bootstrap';
import { ProxyServer } from './app/proxy/proxy.server';

try {

  const windowService = di.get<WindowService>(WindowService);
  const trayService = di.get<TrayService>(TrayService);
  const fsService = di.get<FsService>(FsService);
  const proxyServer = di.get<ProxyServer>(ProxyServer);
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {

    windowService.createWindow();
    trayService.createTray();
    await proxyServer.start();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      proxyServer.stop();
      app.quit();
    }
  });

  ipcMain.on('saveSudoFile', (event, arg) => {
    console.log('saveSudoFile');

    // fsService.moveFileSudo(arg);
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
