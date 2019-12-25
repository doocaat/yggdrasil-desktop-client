import * as sudo from 'sudo-prompt';
import * as fs from 'fs';
import { BrowserWindow } from 'electron';
import { provide } from 'inversify-binding-decorators';

@provide(FsService)
export class FsService {

  moveFileSudo(arg) {
    const options = {
      name: arg.actionTitle,
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
