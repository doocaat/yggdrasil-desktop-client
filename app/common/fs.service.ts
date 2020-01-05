import * as sudo from 'sudo-prompt';
import * as fs from 'fs';
import * as tmp from 'tmp-promise';
import { provide } from 'inversify-binding-decorators';

@provide(FsService)
export class FsService {

   async saveFile(data: any, filePath: string, title?: string) {
    const fileAccess = await this.canWriteFile(filePath);

    if (fileAccess) {
     await this.saveFileSudo(data, filePath, title);
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, error => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  canWriteFile(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.W_OK, (err) => {
        resolve(!err);
      });
    });
  }

  isFileExist(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(filePath)) {
          resolve(true);
        }
      } catch (err) {
        resolve(false);
      }
    });
  }

  private async saveFileSudo(data, targetPath, title = ''): Promise<any> {

    const options = {
      name: title,
    };

    const tmpFilePath = await tmp.tmpName();

    return new Promise((resolve, reject) => {
      fs.writeFile(tmpFilePath, data, error => {
        if (error) {
          reject(error);
        }
        sudo.exec(
          `mv ${tmpFilePath} ${targetPath}`,
          options,
          (errors, stdout, stderr) => {
            if (errors) {
              reject(error);
            }

            resolve(stdout);
          }
        );
      });
    });
  }
}
