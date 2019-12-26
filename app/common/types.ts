export interface LanguageItem {
    name: string;
    code: string;
  }

  export interface PeerAddressItem {
    name: string;
    address: string;
  }

  export interface Config {
      configPath: string;
      peerAddressList: PeerAddressItem[];
      peerAddress: string;
      yggdrasilBinPath: string;
      yggdrasilCtlBinPath: string;
      language: string;
      availableLanguage: LanguageItem[];
  }