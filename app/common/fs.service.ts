import * as sudo from 'sudo-prompt';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { WindowService } from '../window/interfaces/window.service';
import { di } from '../di/container.di';
import { CONFIG_DI } from '../di/config.di';
import { remote, BrowserWindow } from 'electron';

@injectable()
export class FsService {

  moveFileSudo(arg) {
    const options = {
      name: arg.actionTitle,
      icns: `${__dirname}/../../src/assets/tray/connected.png`
    };

    fs.writeFile(arg.tmpFilePath, arg.data, error => {
      if (error) {
        throw error;
      }
      sudo.exec(
        `mv ${arg.tmpFilePath} ${arg.filePath}`,
        options,
        (errors, stdout, stderr) => {
          if (errors) {
            throw errors;
          }

          if (!!arg.responseEventName) {
            console.log('Send ' + arg.responseEventName);
            BrowserWindow.getFocusedWindow().webContents.send(arg.responseEventName, arg.data);
          }
        }
      );
    });
  }
}
