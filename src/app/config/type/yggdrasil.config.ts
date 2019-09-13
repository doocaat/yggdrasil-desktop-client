
export class YggdrasilConfig {
    Peers: string[];
    InterfacePeers: {};
    Listen: string[];
    AdminListen: string;
    MulticastInterfaces: string[];
    AllowedEncryptionPublicKeys: string[];
    EncryptionPublicKey: string;
    EncryptionPrivateKey: string;
    SigningPublicKey: string;
    SigningPrivateKey: string;
    LinkLocalTCPPort: number;
    IfName: 'auto' | 'none';
    IfTAPMode: boolean;
    IfMTU: number;
    SessionFirewall: SessionFirewall;
    TunnelRouting: TunnelRouting;
    SwitchOptions: SwitchOptions;
    NodeInfoPrivacy: boolean;
    NodeInfo: string | null;
}

export class SessionFirewall {
    Enable: boolean;
    AllowFromDirect: boolean;
    AllowFromRemote: boolean;
    AlwaysAllowOutbound: boolean;
    WhitelistEncryptionPublicKeys: any;
    BlacklistEncryptionPublicKeys: any;
}

export class TunnelRouting {
    Enable: boolean;
    IPv6RemoteSubnets: string;
    IPv6LocalSubnets: string;
    IPv4RemoteSubnets: string;
    IPv4LocalSubnets: string;
}

export class SwitchOptions {
    MaxTotalQueueSize: number;
}
