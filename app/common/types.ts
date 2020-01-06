export interface LanguageItem {
    name: string;
    code: string;
  }

  export interface AddressItem {
    name: string;
    address: string;
  }

  export interface Setting {
      configPath: string;
      peerAddressList: AddressItem[];
      peerAddress: string;
      yggdrasilBinPath: string;
      yggdrasilCtlBinPath: string;
      language: string;
      availableLanguage: LanguageItem[];
      proxyHost: string;
      proxyPort: number;
      proxyDnsZoneList: string[];
      dnsServerList: AddressItem[];
  }

  export enum SettingConfigKey {
    peerAddressList = 'peerAddressList',
    peerAddress = 'peerAddress',
    language = 'language',
    configPath = 'configPath',
    yggdrasilPath = 'yggdrasilPath',
    yggdrasilAdminPath = 'yggdrasilAdminPath',
    proxyHost = 'proxy.host',
    proxyPort = 'proxy.port',
    proxyZones = 'proxy.zones',
    dnsServerList = 'dns.servers',
  }
