import { Injectable, NgZone } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElectronService } from '../core/services';
import { YggdrasilConfig } from '../config/type/yggdrasil.config';

@Injectable({
  providedIn: 'root'
})
export class YggdrasilService {
  constructor(private electronService: ElectronService, private zone: NgZone) {}

  getPeers(): Observable<any> {
    return from(this.readRunCommandPromise(`yggdrasilctl -json getPeers`)).pipe(
      map(item => item.peers)
    );
  }

  addPeer(uri: string): Observable<any> {
    return from(
      this.readRunCommandPromise(`yggdrasilctl -json addPeer uri=${uri}`)
    );
  }

  removePeer(port: number): Observable<any> {
    return from(
      this.readRunCommandPromise(`yggdrasilctl -json removePeer port=${port}`)
    );
  }

  getConfig(configPath: string): Observable<any> {
    return from(
      this.readRunCommandPromise(
        `yggdrasil -normaliseconf -useconffile ${configPath} -json`
      )
    );
  }

  saveConfig(config: YggdrasilConfig, configPath: string) {
    return this.sudoSaveFile('Save Yggdrasil config', configPath, config, '/tmp/yggdrasil.conf', 'updateYggdrasilConfig');
  }

  private readRunCommandPromise(command: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.electronService.childProcess.exec(command, (err, stdout, stderr) => {
        if (err !== null) {
          console.error('command run error:', command, stderr);
          return reject(err);
        }
        // console.log('command run:', command, JSON.parse(stdout.toString()));
        resolve(JSON.parse(stdout));
      });
    });
  }

  private saveFilePromise(fileName: string, data): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.electronService.fs.writeFile(fileName, data, err => {
        if (err !== null) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  private sudoSaveFile(actionTitle: string, filePath: string, data: any, tmpFilePath: string, responseEventName: string): void {
    data = JSON.stringify(data, null, 4);
    this.electronService.ipcRenderer.send('saveSudoFile', {
      actionTitle,
      responseEventName,
      tmpFilePath,
      filePath,
      data
    });
  }
}
