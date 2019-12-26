import { YggdrasilService } from './../yggdrasil/yggdrasil.service';
import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from '../core/services';
import { Config } from './type/config';
import { YggdrasilConfig } from './type/yggdrasil.config';
import { plainToClass } from 'class-transformer';
import { from, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _yggdrasilConfig$ = new BehaviorSubject(null);
  configApp = new BehaviorSubject(null);

  constructor(
    private electronService: ElectronService,
    private yggdrasilService: YggdrasilService,
    private zone: NgZone,
  ) {
    this.init();
  }

  private init() {
    const currentConfig = localStorage.getItem('config');

    if (!currentConfig) {
      localStorage.setItem('config', JSON.stringify(this.getDefaultConfig()));
    }

    this.electronService.ipcRenderer.on('updateYggdrasilConfig', (event, args) => {
      this.loadYggdrasilConfig();
    });

    this.electronService.ipcRenderer.on('setting', (event, args) => {
      this.zone.run(() => {
        this.configApp.next(args);
      });
    });
  }

  loadConfig() {
    this.electronService.ipcRenderer.send('getSetting');
  }

  get config(): Config {
    return plainToClass(Config, JSON.parse(localStorage.getItem('config')));
  }

  private getDefaultConfig(): Config {
    const config = new Config();
    config.configPath = this.defaultConfigFilePath;
    return config;
  }

  loadYggdrasilConfig() {
    this.yggdrasilService
      .getConfig(this.config.configPath)
      .subscribe(config => {
        this._yggdrasilConfig$.next(plainToClass(YggdrasilConfig, config));
      });
  }

  saveYggdrasilConfig(config) {
    this.yggdrasilService.saveConfig(config, this.config.configPath);
  }

  get yggdrasilConfig(): YggdrasilConfig {
    return this._yggdrasilConfig$.getValue();
  }

  set yggdrasilConfig(config: YggdrasilConfig) {
    this._yggdrasilConfig$.next(config);
  }

  get yggdrasilConfig$(): Observable<YggdrasilConfig> {
    return this._yggdrasilConfig$.asObservable();
  }

  get defaultConfigFilePath(): string {
    let path = '';
    switch (this.electronService.platform) {
      case 'linux': {
        path = '/etc/yggdrasil.conf';
        break;
      }
    }

    return path;
  }

  private readFilePromise(fileName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.electronService.fs.readFile(fileName, (err, data: Buffer) => {
        if (err !== null) {
          return reject(err);
        }
        resolve(data);
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
}
