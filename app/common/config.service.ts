import { provide } from 'inversify-binding-decorators';
import * as jsonConfig from 'electron-json-config';
import * as os from 'os';
import { app, ipcMain, BrowserWindow } from 'electron';
import { PeerAddressItem, ConfigPathItem, Config } from './types';

@provide(ConfigService)
export class ConfigService {

    constructor() {
        this.initHandlers();
    }

  initHandlers() {
    ipcMain.on('getConfig', (event, arg) => {
      console.log('ELECTRON: ConfigService.getConfig');
      BrowserWindow.getFocusedWindow().webContents.send(
        'config',
        this.getConfig()
      );
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
    return jsonConfig.get('language', 'en');
  }

  getPeerAddressList(): PeerAddressItem[] {
    return jsonConfig.get('peerAddressList', [
      { name: 'localhost', address: this.getPeerAddress() }
    ]);
  }

  getConfigPathList(): ConfigPathItem[] {
    return jsonConfig.get('configPathList', [
      { name: 'default', path: this.getDefaultConfigPath() }
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
      configPathList: this.getConfigPathList(),
      configPath: this.getConfigPath(),
      peerAddressList: this.getPeerAddressList(),
      peerAddress: this.getYggdrasilCtlBinPath(),
      yggdrasilBinPath: this.getYggdrasilBinPath(),
      yggdrasilCtlBinPath: this.getYggdrasilCtlBinPath(),
      language: this.getLanguage()
    };
  }

  setConfig(config: Config) {
    // todo
  }
}
