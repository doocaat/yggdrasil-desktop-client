import { provide } from 'inversify-binding-decorators';
import * as jsonConfig from 'electron-json-config';
import * as os from 'os';
import { app, ipcMain, BrowserWindow } from 'electron';
import { PeerAddressItem, Config, LanguageItem } from './types';
import { EnvConfig } from '../env.config';
import { inject } from 'inversify';

@provide(ConfigService)
export class ConfigService {
  constructor(
    @inject(EnvConfig)
    private readonly envConfig: EnvConfig
  ) {
    this.initHandlers();
  }

  initHandlers() {
    ipcMain.on('getConfig', (event, arg) => {
      let window = BrowserWindow.getFocusedWindow();

      if (!window) {
        window = BrowserWindow.getAllWindows()[0];
      }

      if (window) {
        window.webContents.send('config', this.getConfig());
      }
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

  getPeerAddress(): string {
    return 'tcp://localhost:9091';
  }

  getLanguage(): string {
    return jsonConfig.get('language', this.envConfig.defaultLanguage);
  }

  getAvailableLanguage(): LanguageItem[] {
    return  this.envConfig.availableLanguage;
  }

  getPeerAddressList(): PeerAddressItem[] {
    return jsonConfig.get('peerAddressList', [
      { name: 'localhost', address: this.getPeerAddress() }
    ]);
  }

  getConfigPath(): string {
    return jsonConfig.get('configPath', this.getDefaultConfigPath());
  }

  getYggdrasilBinPath(): string {
    return jsonConfig.get('yggdrasilPath', 'yggdrasil');
  }

  getYggdrasilCtlBinPath(): string {
    return jsonConfig.get('yggdrasilAdminPath', 'yggdrasilctl');
  }

  getConfig(): Config {
    return {
      configPath: this.getConfigPath(),
      peerAddressList: this.getPeerAddressList(),
      peerAddress: this.getYggdrasilCtlBinPath(),
      yggdrasilBinPath: this.getYggdrasilBinPath(),
      yggdrasilCtlBinPath: this.getYggdrasilCtlBinPath(),
      language: this.getLanguage(),
      availableLanguage: this.getAvailableLanguage()
    };
  }

  setConfig(config: Config) {
    // todo
  }
}
