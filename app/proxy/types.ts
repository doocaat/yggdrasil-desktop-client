
export interface DomainNameServer {
    connectionType: DomainNameServerConnection;
    host: string;
    port: number;
}

export enum DomainNameServerConnection {
    TLS = 'tls',
    DOH = 'doh',
    TCP = 'tcp',
    UDP = 'udp'
}

export enum RequestRecordType {
    A = 'A',
    AAAA = 'AAAA',
    MX = 'MX',
    TEXT = 'TEXT',
    SRV = 'SRV',
    CNAME = 'CNAME',
    NS = 'NS',
    SOA = 'SOA'
}

export interface DnsAnswer {
      name: string;
      type: RequestRecordType;
      ttl: number;
      class: string;
      flush: boolean;
      data: string;
}
