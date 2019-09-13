import { Injectable } from '@angular/core';
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

  constructor(private electronService: ElectronService) {
    this.init();
  }

  private init() {
    const currentConfig = localStorage.getItem('config');

    if (!currentConfig) {
      localStorage.setItem('config', JSON.stringify(this.getDefaultConfig()));
    }
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
    from(this.readFilePromise(this.config.configPath)).subscribe(
      config => {
        this._yggdrasilConfig$.next(plainToClass(
          YggdrasilConfig,
          JSON.parse(config.toString())));
      }
    );
  }

  get yggdrasilConfig(): YggdrasilConfig {
    return this._yggdrasilConfig$.getValue();
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
}
