export interface ConfigPathItem {
    name: string;
    path: string;
  }

  export interface PeerAddressItem {
    name: string;
    address: string;
  }

  export interface Config {
      configPathList: ConfigPathItem[];
      configPath: string;
      peerAddressList: PeerAddressItem[];
      peerAddress: string;
      yggdrasilBinPath: string;
      yggdrasilCtlBinPath: string;
      language: string;
  }