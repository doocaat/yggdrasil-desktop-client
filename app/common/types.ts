export interface LanguageItem {
    name: string;
    code: string;
  }

  export interface PeerAddressItem {
    name: string;
    address: string;
  }

  export interface Setting {
      configPath: string;
      peerAddressList: PeerAddressItem[];
      peerAddress: string;
      yggdrasilBinPath: string;
      yggdrasilCtlBinPath: string;
      language: string;
      availableLanguage: LanguageItem[];
  }

  export enum SettingConfigKey {
    peerAddressList = 'peerAddressList',
    peerAddress = 'peerAddress',
    language = 'language',
    configPath = 'configPath',
    yggdrasilPath = 'yggdrasilPath',
    yggdrasilAdminPath = 'yggdrasilAdminPath'
  }
