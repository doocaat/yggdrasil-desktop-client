import { app, ipcMain } from 'electron';
import * as sudo from 'sudo-prompt';
import * as fs from 'fs';
import ElectronApp from './electron_app/electron-app';

try {
  const electronApp = new ElectronApp();
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    electronApp.createConfigWindow();
    electronApp.createTray();
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
        electronApp.configWindow.webContents.send(arg.responseEventName, arg.data);
      });
    });
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electronApp.configWindow === null) {
      electronApp.createConfigWindow();
    }

    if (electronApp.tray === null) {
      electronApp.createTray();
    }
  });
} catch (e) {
  // Catch Error
  throw e;
}
