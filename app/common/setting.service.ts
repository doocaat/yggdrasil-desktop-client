import { provide } from 'inversify-binding-decorators';
import * as jsonConfig from 'electron-json-config';
import * as os from 'os';
import { app, ipcMain, BrowserWindow } from 'electron';
import {
  PeerAddressItem,
  Setting,
  LanguageItem,
  SettingConfigKey
} from './types';
import { EnvConfig } from '../env.config';
import { inject } from 'inversify';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { WindowService } from './window.service';

@provide(SettingService)
export class SettingService {
  private _language$ = new BehaviorSubject<string>(this.getLanguage());
  private _configPath$ = new BehaviorSubject<string>(this.getConfigPath());
  private _peerAddress$ = new BehaviorSubject<string>(this.getPeerAddress());

  constructor(
    @inject(EnvConfig)
    private readonly envConfig: EnvConfig,
    @inject(WindowService)
    private readonly windowService: WindowService
  ) {
    this.initHandlers();
  }

  initHandlers() {
    ipcMain.on('getSetting', (event, arg) => {
      this.windowService.sendAllWindow('setting', this.getSetting());
    });

    ipcMain.on('setSetting', (event, arg) => {
      this.setSetting(arg);
      this.windowService.sendAllWindow('setting', this.getSetting());
    });

    this._language$.pipe(distinctUntilChanged()).subscribe(lang => {
      this.windowService.sendAllWindow('language', lang);
    });
  }

  getDefaultConfigPath(): string {
    let path = 'yggdrasil.conf';
    switch (os.platform()) {
      case 'linux': {
        path = '/etc/yggdrasil.conf';
        break;
      }
    }
    return path;
  }

  getDefaultPeerAddress(): string {
    return this.envConfig.peerAddress;
  }

  getPeerAddress(): string {
    return jsonConfig.get(
      SettingConfigKey.peerAddress,
      this.getDefaultPeerAddress()
    );
  }

  setPeerAddress(address: string) {
    jsonConfig.get(SettingConfigKey.peerAddress, address);
  }

  getLanguage(): string {
    return jsonConfig.get(
      SettingConfigKey.language,
      this.envConfig.defaultLanguage
    );
  }

  setLanguage(lang: string): string {
    this._language$.next(lang);
    return jsonConfig.set(SettingConfigKey.language, lang);
  }

  getAvailableLanguage(): LanguageItem[] {
    return this.envConfig.availableLanguage;
  }

  getPeerAddressList(): PeerAddressItem[] {
    return jsonConfig.get(SettingConfigKey.peerAddressList, [
      { name: 'localhost', address: this.getDefaultPeerAddress() }
    ]);
  }

  setPeerAddressList(list: PeerAddressItem[]) {
    jsonConfig.get(SettingConfigKey.peerAddressList, list);
  }

  getConfigPath(): string {
    return jsonConfig.get(
      SettingConfigKey.configPath,
      this.getDefaultConfigPath()
    );
  }

  setConfigPath(path: string) {
    this._configPath$.next(path);
    jsonConfig.set(SettingConfigKey.configPath, path);
  }

  getYggdrasilBinPath(): string {
    return jsonConfig.get(SettingConfigKey.yggdrasilPath, 'yggdrasil');
  }

  setYggdrasilBinPath(path: string) {
    jsonConfig.set(SettingConfigKey.yggdrasilPath, path);
  }

  getYggdrasilCtlBinPath(): string {
    return jsonConfig.get(SettingConfigKey.yggdrasilAdminPath, 'yggdrasilctl');
  }

  setYggdrasilCtlBinPath(path: string) {
    jsonConfig.set(SettingConfigKey.yggdrasilAdminPath, path);
  }

  getSetting(): Setting {
    return {
      configPath: this.getConfigPath(),
      peerAddressList: this.getPeerAddressList(),
      peerAddress: this.getPeerAddress(),
      yggdrasilBinPath: this.getYggdrasilBinPath(),
      yggdrasilCtlBinPath: this.getYggdrasilCtlBinPath(),
      language: this.getLanguage(),
      availableLanguage: this.getAvailableLanguage()
    };
  }

  setSetting(setting: Setting) {
    this.setLanguage(setting.language);
    this.setConfigPath(setting.configPath);
    this.setYggdrasilBinPath(setting.yggdrasilBinPath);
    this.setYggdrasilCtlBinPath(setting.yggdrasilCtlBinPath);
    this.setPeerAddressList(setting.peerAddressList);
    this.setPeerAddress(setting.peerAddress);
  }
}
