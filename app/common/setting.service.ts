import { provide } from 'inversify-binding-decorators';
import * as jsonConfig from 'electron-json-config';
import * as os from 'os';
import { app, ipcMain, BrowserWindow } from 'electron';
import {
  AddressItem,
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

  private window: BrowserWindow | true;

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
      this.sendAllWindow('setting', this.getSetting());
    });

    ipcMain.on('setSetting', (event, arg) => {
      this.setSetting(arg);
      this.sendAllWindow('setting', this.getSetting());
    });

    ipcMain.on('setting:open', (event, arg) => {
      console.log('setting:open');
      this.createWindow();
    });

    this._language$.pipe(distinctUntilChanged()).subscribe(lang => {
      this.sendAllWindow('language', lang);
    });

  }

  createWindow() {
    if (this.window) {
      // this.window.show();
      return;
    }

    this.window = this.windowService.createWindow('#/settings/main', true, 545, 685);

    this.window.on('close', () => {
      this.window = null;
    });
  }

  sendAllWindow(channel: string, data?: any) {
    BrowserWindow.getAllWindows()
    .forEach(window => {
      window.webContents.send(channel, data);
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

  getPeerAddressList(): AddressItem[] {
    return jsonConfig.get(SettingConfigKey.peerAddressList, [
      { name: 'localhost', address: this.getDefaultPeerAddress() }
    ]);
  }

  setPeerAddressList(list: AddressItem[]) {
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

  getDefaultProxyHost(): string {
    return this.envConfig.proxy.host;
  }

  getProxyHost(): string {
    return jsonConfig.get(
      SettingConfigKey.proxyHost,
      this.getDefaultProxyHost()
    );
  }

  setProxyHost(host: string) {
    jsonConfig.get(SettingConfigKey.proxyHost, host);
  }

  getDefaultProxyPort(): number {
    return this.envConfig.proxy.port;
  }

  getProxyPort(): number {
    return jsonConfig.get(
      SettingConfigKey.proxyPort,
      this.getDefaultProxyPort()
    );
  }

  setProxyPort(port: number) {
    jsonConfig.get(SettingConfigKey.proxyPort, port);
  }

  getDefaultProxyZones(): string[] {
    return this.envConfig.proxy.zones;
  }

  getProxyZones(): string[] {
    return jsonConfig.get(
      SettingConfigKey.proxyZones,
      this.getDefaultProxyZones()
    );
  }

  setProxyZones(zones: string[]) {
    jsonConfig.get(SettingConfigKey.proxyZones, zones);
  }

  getDefaultDnsServerList(): AddressItem[] {
    return this.envConfig.dns.servers;
  }

  getDnsServerList(): AddressItem[] {
    return jsonConfig.get(
      SettingConfigKey.dnsServerList,
      this.getDefaultDnsServerList()
    );
  }

  setDnsServerList(dnsServers: AddressItem[]) {
    jsonConfig.get(SettingConfigKey.dnsServerList, dnsServers);
  }

  getSetting(): Setting {
    return {
      configPath: this.getConfigPath(),
      peerAddressList: this.getPeerAddressList(),
      peerAddress: this.getPeerAddress(),
      yggdrasilBinPath: this.getYggdrasilBinPath(),
      yggdrasilCtlBinPath: this.getYggdrasilCtlBinPath(),
      language: this.getLanguage(),
      availableLanguage: this.getAvailableLanguage(),
      proxyHost: this.getProxyHost(),
      proxyPort: this.getProxyPort(),
      proxyDnsZoneList: this.getProxyZones(),
      dnsServerList: this.getDnsServerList(),
    };
  }

  setSetting(setting: Setting) {
    this.setLanguage(setting.language);
    this.setConfigPath(setting.configPath);
    this.setYggdrasilBinPath(setting.yggdrasilBinPath);
    this.setYggdrasilCtlBinPath(setting.yggdrasilCtlBinPath);
    this.setPeerAddressList(setting.peerAddressList);
    this.setPeerAddress(setting.peerAddress);
    this.setProxyZones(setting.proxyDnsZoneList);
    this.setProxyHost(setting.proxyHost);
    this.setProxyPort(setting.proxyPort);
    this.setDnsServerList(setting.dnsServerList);
  }
}
